import { Context } from "hono";

import { connectDb } from "../lib/connectDb.js";
import { UserModel } from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (c: Context) => {
  await connectDb();

  const { email, password } = await c.req.json();
  if (!email) {
    return c.json(
      {
        message: "Email uguuch",
      },
      400,
    );
  }
  if (!password) {
    return c.json(
      {
        message: "password yawuul",
      },
      400,
    );
  }
  const signedUp = await UserModel.find({ email }); // []
  if (signedUp.length > 0) {
    return c.json(
      {
        message: "Burtgeltei bn",
      },
      400,
    );
  }

  const hashedPassword = bcrypt.hashSync(password, 10); // pass123 -> $31joidsd893jlkasd/

  const isCorrect = bcrypt.compareSync(password, hashedPassword); // true false
  const newUser = await UserModel.create({
    email,
    password: hashedPassword,
  });
  return c.json({
    message: "Amjilttai hereglegch burtgelee",
    user: newUser,
  });
};
export const signedIn = async (c: Context) => {
  await connectDb();

  const { email, password } = await c.req.json();
  if (!email) {
    return c.json(
      {
        message: "Email uguuch",
      },
      400,
    );
  }
  if (!password) {
    return c.json(
      {
        message: "password yawuul",
      },
      400,
    );
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return c.json({
      message: "ehleed burtguuulnuu",
    });
  }
  const isCorrect = bcrypt.compareSync(password, user.password!);
  if (!isCorrect) {
    return c.json(
      {
        message: "password buruu bn",
      },
      400,
    );
  }
  return c.json({
    message: "amjulttai newterlee",
  });
};
