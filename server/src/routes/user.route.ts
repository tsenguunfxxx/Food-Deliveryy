import { Hono } from "hono";
import { signedIn, signUp } from "../controllers/user.controller.js";
const userRoute = new Hono();

userRoute.post("/signUp", signUp);
userRoute.post("/signedIn", signedIn);
export default userRoute;
