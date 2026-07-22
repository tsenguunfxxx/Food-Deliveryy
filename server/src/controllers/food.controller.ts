import { Context } from "hono";
import { connectDb } from "../lib/connectDb.js";
import { FoodModel } from "../model/food.model.js";
import { FoodCategoryModel } from "../model/food-category-model.js";

export const create = async (c: Context) => {
  await connectDb();

  const input = await c.req.json();

  const response = await FoodModel.create({
    foodName: input.foodName,
    price: input.price,
    ingredients: input.ingredients,
    image: input.image,
    category: input.category,
  });

  return c.json({
    message: "Food created successfully",
    response,
  });
};
export const getFoods = async (c: Context) => {
  await connectDb();
  const response = await FoodModel.find();
  return c.json({
    message: "Hoolnuuda aw",
    foods: response,
  });
};
export const updateCategory = async (c: Context) => {
  await connectDb();

  const id = c.req.param("id");
  const body = await c.req.json();

  const response = await FoodModel.findByIdAndUpdate(id, {
    foodName: body.foodname,
    price: body.price,
    ingredients: body.ingredients,
    image: body.image,
    category: body.category,
  });

  return c.json({
    message: "Successfully updated",
    response,
  });
};
