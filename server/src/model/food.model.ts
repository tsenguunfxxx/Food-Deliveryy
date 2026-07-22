import mongoose, { Schema } from "mongoose";

const FoodSchema = new Schema({
  foodName: {
    type: String,
    required: true,
  },
  price: Number,
  ingredients: String,
  image: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "foodCategory",
  },
});

export const FoodModel =
  mongoose.models.Food || mongoose.model("Food", FoodSchema);
