import mongoose, { Schema, model } from "mongoose";

const FoodOrderItemSchema = new Schema(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const FoodOrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    foodOrderItems: {
      type: [FoodOrderItemSchema],
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const FoodOrderModel =
  mongoose.models.FoodOrder || model("FoodOrder", FoodOrderSchema);
