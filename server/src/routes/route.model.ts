import { Hono } from "hono";
import {
  create,
  getFoods,
  updateCategory,
} from "../controllers/food.controller.js";

const FoodRoute = new Hono();

FoodRoute.post("/", create);
FoodRoute.get("/", getFoods);
FoodRoute.put("/:id", updateCategory);

export default FoodRoute;
