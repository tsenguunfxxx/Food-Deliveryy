import { connectDb } from "../lib/connectDb.js";
import { FoodCategoryModel } from "../model/food-category-model.js";

export const createFoodcategory = async (c) => {
  await connectDb();

  const input = await c.req.json();

  const category = await FoodCategoryModel.create({
    categoryName: input.categoryName,
  });

  return c.json({
    message: "Successfully created food category",
    category,
  });
};

export const getFoodCategories = async (c) => {
  await connectDb();

  const foodCategories = await FoodCategoryModel.find();

  return c.json({
    message: "Categories fetched successfully",
    foodCategories,
  });
};

export const updateCategory = async (c) => {
  await connectDb();

  const id = c.req.param("id");
  const input = await c.req.json();

  const response = await FoodCategoryModel.findByIdAndUpdate(
    id,
    {
      categoryName: input.categoryName,
    },
    {
      new: true,
    },
  );

  if (!response) {
    return c.json(
      {
        message: "Category not found",
      },
      404,
    );
  }

  return c.json({
    message: "Successfully updated",
    response,
  });
};

export default createFoodcategory;
