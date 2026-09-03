import type { AuthUser } from "@/common/common";

const TOKEN_KEY = "nomnom-token";
const USER_KEY = "nomnom-user";

export const readToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const readUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const writeSession = (token: string, user: AuthUser) => {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // хадгалж чадахгүй бол зөвхөн энэ таб дотор нэвтэрсэн хэвээр үлдэнэ
  }
};

export const clearSession = () => {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // алгасна
  }
};
