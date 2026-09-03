import { Hono } from "hono";

import { uploadImage } from "../controllers/upload.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const UploadRoute = new Hono();

UploadRoute.post("/", requireAuth, requireAdmin, uploadImage);

export default UploadRoute;
