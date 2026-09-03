"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "@/common/common";
import { api } from "@/lib/api";
import { clearSession, readUser, writeSession } from "@/lib/auth-storage";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // localStorage-г зөвхөн browser дээр уншина — SSR-тэй зөрчилдөхгүйн тулд.
  useEffect(() => {
    const stored = readUser();
    setUser(stored);
    setReady(true);

    if (!stored) return;

    // Token хугацаа дуусаагүй эсэхийг сервер дээр батална.
    api
      .get<{ user: AuthUser }>("/user/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        clearSession();
        setUser(null);
      });
  }, []);

  const authenticate = async (
    path: "/user/signedIn" | "/user/signUp",
    email: string,
    password: string,
  ) => {
    const response = await api.post<{ token: string; user: AuthUser }>(path, {
      email,
      password,
    });
    writeSession(response.data.token, response.data.user);
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        isAdmin: user?.role === "ADMIN",
        signIn: (email, password) =>
          authenticate("/user/signedIn", email, password),
        signUp: (email, password) =>
          authenticate("/user/signUp", email, password),
        signOut: () => {
          clearSession();
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth-г AuthProvider дотор ашиглана");
  }
  return context;
};
