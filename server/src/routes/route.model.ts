import { Hono } from "hono";
import {
  create,
  deleteFood,
  getFoods,
  updateFood,
} from "../controllers/food.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const FoodRoute = new Hono();

FoodRoute.get("/", getFoods);
FoodRoute.post("/", requireAuth, requireAdmin, create);
FoodRoute.put("/:id", requireAuth, requireAdmin, updateFood);
FoodRoute.delete("/:id", requireAuth, requireAdmin, deleteFood);

export default FoodRoute;
