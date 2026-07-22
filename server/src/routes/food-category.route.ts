import { Hono } from "hono";
import {
  createFoodcategory,
  getFoodCategories,
} from "../controllers/food-category-controller.js";
import { updateCategory } from "../controllers/food.controller.js";

const FoodCategoryRoute = new Hono();

FoodCategoryRoute.post("/", createFoodcategory);
FoodCategoryRoute.get("/", getFoodCategories);
FoodCategoryRoute.put("/", updateCategory);

export default FoodCategoryRoute;
