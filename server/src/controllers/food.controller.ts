import { Context } from "hono";
import { connectDb } from "../lib/connectDb.js";
import { FoodModel } from "../model/food.model.js";

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

export const updateFood = async (c: Context) => {
  await connectDb();

  const id = c.req.param("id");
  const body = await c.req.json();

  // Илгээгээгүй талбарыг хөндөхгүй.
  const update: Record<string, unknown> = {};
  for (const key of ["foodName", "price", "ingredients", "image", "category"]) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  const response = await FoodModel.findByIdAndUpdate(id, update, { new: true });

  if (!response) {
    return c.json({ message: "Хоол олдсонгүй" }, 404);
  }

  return c.json({
    message: "Successfully updated",
    response,
  });
};

export const deleteFood = async (c: Context) => {
  await connectDb();

  const id = c.req.param("id");
  const response = await FoodModel.findByIdAndDelete(id);

  if (!response) {
    return c.json({ message: "Хоол олдсонгүй" }, 404);
  }

  return c.json({ message: "Successfully deleted", response });
};
