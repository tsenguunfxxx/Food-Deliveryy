import { Hono } from "hono";

import {
  getMe,
  requestPasswordReset,
  resetPassword,
  signedIn,
  signUp,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const userRoute = new Hono();

userRoute.post("/signUp", signUp);
userRoute.post("/signedIn", signedIn);
userRoute.post("/forgot-password", requestPasswordReset);
userRoute.post("/reset-password", resetPassword);
userRoute.get("/me", requireAuth, getMe);

export default userRoute;
