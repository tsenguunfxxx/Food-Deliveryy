import { Hono } from "hono";
import { cors } from "hono/cors";

import { connectDb } from "./lib/connectDb.js";
import FoodCategoryRoute from "./routes/food-category.route.js";
import FoodRoute from "./routes/route.model.js";
import { FoodCategoryModel } from "./model/food-category-model.js";
import userRoute from "./routes/user.route.js";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("ajillaj baina");
});

app.route("/category", FoodCategoryRoute);
app.route("/food", FoodRoute);
app.route("/user", userRoute);

app.delete("/category/:id", async (c) => {
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
