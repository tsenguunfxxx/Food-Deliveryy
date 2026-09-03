import { Hono } from "hono";
import {
  createFoodcategory,
  getFoodCategories,
  updateCategory,
} from "../controllers/food-category-controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const FoodCategoryRoute = new Hono();

FoodCategoryRoute.get("/", getFoodCategories);
FoodCategoryRoute.post("/", requireAuth, requireAdmin, createFoodcategory);
FoodCategoryRoute.put("/:id", requireAuth, requireAdmin, updateCategory);

export default FoodCategoryRoute;
