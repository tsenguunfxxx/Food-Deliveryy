import { Schema, model } from "mongoose";
const UserSchema = new Schema(
  {
    email: String,
    phoneNumber: String,
    password: String,
    address: String,
    isVerified: Boolean,
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    // Түүхий token-ыг биш, зөвхөн hash-ийг хадгална — DB задарсан ч
    // хэн нэгний нууц үгийг сэргээх боломжгүй байхын тулд.
    resetPasswordTokenHash: String,
    resetPasswordExpiresAt: Date,
  },
  {
    timestamps: true,
  },
);
export const UserModel = model("user", UserSchema);
