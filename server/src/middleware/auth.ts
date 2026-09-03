import { Context, Next } from "hono";

import { verifyToken, type TokenPayload } from "../lib/jwt.js";

const readToken = (c: Context) => {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
};

/** Token байвал уншина, байхгүй бол ч цааш нэвтрүүлнэ. */
export const optionalAuth = async (c: Context, next: Next) => {
  const token = readToken(c);
  if (token) {
    try {
      c.set("user", await verifyToken(token));
    } catch {
      // хүчингүй token-ыг зочин мэт үзнэ
    }
  }
  await next();
};

/** Зөвхөн нэвтэрсэн хэрэглэгч. */
export const requireAuth = async (c: Context, next: Next) => {
  const token = readToken(c);
  if (!token) {
    return c.json({ message: "Нэвтэрнэ үү" }, 401);
  }
  try {
    c.set("user", await verifyToken(token));
  } catch {
    return c.json({ message: "Token хүчингүй эсвэл хугацаа нь дууссан" }, 401);
  }
  await next();
};

/** Зөвхөн ADMIN эрхтэй хэрэглэгч. */
export const requireAdmin = async (c: Context, next: Next) => {
  const user = c.get("user") as TokenPayload | undefined;
  if (!user) {
    return c.json({ message: "Нэвтэрнэ үү" }, 401);
  }
  if (user.role !== "ADMIN") {
    return c.json({ message: "Админ эрх шаардлагатай" }, 403);
  }
  await next();
};
