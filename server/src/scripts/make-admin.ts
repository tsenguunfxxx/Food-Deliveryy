/**
 * Хэрэглэгчид ADMIN эрх олгоно.
 *   npm run make-admin -- taniiMail@example.com
 */
import mongoose from "mongoose";

import { connectDb } from "../lib/connectDb.js";
import { UserModel } from "../model/user.model.js";

const email = process.argv[2];

if (!email) {
  console.error("Хэрэглээ: npm run make-admin -- <email>");
  process.exit(1);
}

await connectDb();

const user = await UserModel.findOneAndUpdate(
  { email },
  { role: "ADMIN" },
  { new: true },
);

if (!user) {
  console.error(`"${email}" имэйлтэй хэрэглэгч олдсонгүй. Эхлээд бүртгүүлнэ үү.`);
} else {
  console.log(`${user.email} → ${user.role}`);
}

await mongoose.disconnect();
