import { sign, verify } from "hono/jwt";

const ALG = "HS256";
const EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7; // 7 хоног

export type TokenPayload = {
  sub: string;
  email: string;
  role: "ADMIN" | "USER";
  exp: number;
};

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET тохируулаагүй байна");
  }
  return secret;
};

export const signToken = async (user: {
  _id: unknown;
  email?: string | null;
  role?: string | null;
}) => {
  const payload: TokenPayload = {
    sub: String(user._id),
    email: user.email ?? "",
    role: (user.role as "ADMIN" | "USER") ?? "USER",
    exp: Math.floor(Date.now() / 1000) + EXPIRES_IN_SECONDS,
  };
  return sign(payload, getSecret(), ALG);
};

export const verifyToken = async (token: string) => {
  return (await verify(token, getSecret(), ALG)) as unknown as TokenPayload;
};
