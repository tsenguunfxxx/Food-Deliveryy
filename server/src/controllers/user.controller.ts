import { Context } from "hono";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { connectDb } from "../lib/connectDb.js";
import { signToken, type TokenPayload } from "../lib/jwt.js";
import { sendPasswordResetEmail } from "../lib/mailer.js";
import { validatePassword } from "../lib/password.js";
import { UserModel } from "../model/user.model.js";

/** Нууц үг хэзээ ч клиент рүү явахгүй. */
const toPublicUser = (user: any) => ({
  _id: user._id,
  email: user.email,
  role: user.role,
  address: user.address ?? "",
  phoneNumber: user.phoneNumber ?? "",
});

export const signUp = async (c: Context) => {
  await connectDb();

  const { email, password } = await c.req.json();

  if (!email) {
    return c.json({ message: "Имэйлээ оруулна уу" }, 400);
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return c.json({ message: passwordError }, 400);
  }

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return c.json({ message: "Энэ имэйл бүртгэлтэй байна" }, 400);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await UserModel.create({ email, password: hashedPassword });

  const token = await signToken(newUser);

  return c.json({
    message: "Амжилттай бүртгэлээ",
    token,
    user: toPublicUser(newUser),
  });
};

export const signedIn = async (c: Context) => {
  await connectDb();

  const { email, password } = await c.req.json();

  if (!email) {
    return c.json({ message: "Имэйлээ оруулна уу" }, 400);
  }
  if (!password) {
    return c.json({ message: "Нууц үгээ оруулна уу" }, 400);
  }

  const user = await UserModel.findOne({ email });

  // Имэйл байхгүй, нууц үг буруу хоёрыг ялгаж хэлэхгүй —
  // эс бөгөөс ямар имэйл бүртгэлтэйг гаднаас таах боломжтой болно.
  if (!user || !bcrypt.compareSync(password, user.password!)) {
    return c.json({ message: "Имэйл эсвэл нууц үг буруу байна" }, 401);
  }

  const token = await signToken(user);

  return c.json({
    message: "Амжилттай нэвтэрлээ",
    token,
    user: toPublicUser(user),
  });
};

export const getMe = async (c: Context) => {
  await connectDb();

  const payload = c.get("user") as TokenPayload;
  const user = await UserModel.findById(payload.sub);

  if (!user) {
    return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404);
  }

  return c.json({ user: toPublicUser(user) });
};

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 цаг

const hashResetToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const requestPasswordReset = async (c: Context) => {
  await connectDb();

  const { email } = await c.req.json();

  if (!email) {
    return c.json({ message: "Имэйлээ оруулна уу" }, 400);
  }

  const user = await UserModel.findOne({ email });

  // Хэрэглэгч байгаа эсэхээс үл хамааран ижил хариу буцаана —
  // эс бөгөөс ямар имэйл бүртгэлтэйг гаднаас шалгах боломжтой болно.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");

    user.set({
      resetPasswordTokenHash: hashResetToken(token),
      resetPasswordExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });
    await user.save();

    const appUrl = process.env.APP_URL ?? "http://localhost:3001";
    const link = `${appUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(email, link);
    } catch (error) {
      console.error("Имэйл илгээхэд алдаа гарлаа:", error);
    }
  }

  return c.json({
    message: "Хэрэв энэ имэйл бүртгэлтэй бол сэргээх холбоос илгээгдлээ.",
  });
};

export const resetPassword = async (c: Context) => {
  await connectDb();

  const { token, password } = await c.req.json();

  if (!token) {
    return c.json({ message: "Сэргээх холбоос буруу байна" }, 400);
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return c.json({ message: passwordError }, 400);
  }

  const user = await UserModel.findOne({
    resetPasswordTokenHash: hashResetToken(token),
    resetPasswordExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return c.json(
      { message: "Холбоосын хугацаа дууссан эсвэл хүчингүй байна" },
      400,
    );
  }

  // Token-ыг нэг л удаа ашиглана.
  user.set({
    password: bcrypt.hashSync(password, 10),
    resetPasswordTokenHash: undefined,
    resetPasswordExpiresAt: undefined,
  });
  await user.save();

  return c.json({ message: "Нууц үг амжилттай шинэчлэгдлээ" });
};
