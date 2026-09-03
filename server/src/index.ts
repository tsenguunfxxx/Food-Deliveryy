import { Hono } from "hono";
import { cors } from "hono/cors";

import { connectDb } from "./lib/connectDb.js";
import FoodCategoryRoute from "./routes/food-category.route.js";
import FoodRoute from "./routes/route.model.js";
import { FoodCategoryModel } from "./model/food-category-model.js";
import userRoute from "./routes/user.route.js";
import OrderRoute from "./routes/order.route.js";
import UploadRoute from "./routes/upload.route.js";
import { requireAdmin, requireAuth } from "./middleware/auth.js";

const app = new Hono();

// CORS_ORIGINS тохируулсан бол зөвхөн тэр домэйнуудыг зөвшөөрнө.
// Хоосон үед бүгдэд нээлттэй — зөвхөн хөгжүүлэлтэд тохирно.
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  "*",
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    credentials: allowedOrigins.length > 0,
  }),
);

app.get("/", (c) => {
  return c.text("ajillaj baina");
});

app.route("/category", FoodCategoryRoute);
app.route("/food", FoodRoute);
app.route("/user", userRoute);
app.route("/order", OrderRoute);
app.route("/upload", UploadRoute);

app.delete("/category/:id", requireAuth, requireAdmin, async (c) => {
  await connectDb();

  const id = c.req.param("id");

  const response = await FoodCategoryModel.findByIdAndDelete(id);

  return c.json({
    message: "Successfully deleted",
    response,
  });
});
//
export default app;
