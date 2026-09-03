import { Context } from "hono";

import { connectDb } from "../lib/connectDb.js";
import type { TokenPayload } from "../lib/jwt.js";
import { FoodModel } from "../model/food.model.js";
import { FoodOrderModel } from "../model/order.model.js";

const ORDER_STATUSES = ["PENDING", "DELIVERED", "CANCELED"];

export const createOrder = async (c: Context) => {
  await connectDb();

  const auth = c.get("user") as TokenPayload;
  const { foodOrderItems, deliveryAddress } = await c.req.json();

  if (!Array.isArray(foodOrderItems) || foodOrderItems.length === 0) {
    return c.json({ message: "Сагс хоосон байна" }, 400);
  }
  if (!deliveryAddress) {
    return c.json({ message: "Хүргэлтийн хаягаа оруулна уу" }, 400);
  }

  // Үнийг клиентээс биш, DB-ээс уншиж бодно.
  const foodIds = foodOrderItems.map((item) => item.food);
  const foods = await FoodModel.find({ _id: { $in: foodIds } });

  const priceById = new Map(
    foods.map((food: any) => [String(food._id), food.price ?? 0]),
  );

  let totalPrice = 0;
  for (const item of foodOrderItems) {
    const price = priceById.get(String(item.food));
    if (price === undefined) {
      return c.json({ message: `Хоол олдсонгүй: ${item.food}` }, 400);
    }
    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) {
      return c.json({ message: "Тоо ширхэг буруу байна" }, 400);
    }
    totalPrice += price * quantity;
  }

  const order = await FoodOrderModel.create({
    user: auth.sub,
    foodOrderItems,
    deliveryAddress,
    totalPrice,
  });

  return c.json({ message: "Захиалга амжилттай үүслээ", order });
};

export const getOrders = async (c: Context) => {
  await connectDb();

  const auth = c.get("user") as TokenPayload;
  const filter = auth.role === "ADMIN" ? {} : { user: auth.sub };

  const orders = await FoodOrderModel.find(filter)
    .populate("foodOrderItems.food")
    .populate("user", "email")
    .sort({ createdAt: -1 });

  return c.json({ message: "Захиалгууд", orders });
};

export const updateOrderStatus = async (c: Context) => {
  await connectDb();

  const id = c.req.param("id");
  const { status } = await c.req.json();

  if (!ORDER_STATUSES.includes(status)) {
    return c.json({ message: "Төлөв буруу байна" }, 400);
  }

  const order = await FoodOrderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!order) {
    return c.json({ message: "Захиалга олдсонгүй" }, 404);
  }

  return c.json({ message: "Төлөв шинэчлэгдлээ", order });
};

export const updateOrdersStatus = async (c: Context) => {
  await connectDb();

  const { ids, status } = await c.req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return c.json({ message: "Захиалга сонгоно уу" }, 400);
  }
  if (!ORDER_STATUSES.includes(status)) {
    return c.json({ message: "Төлөв буруу байна" }, 400);
  }

  const result = await FoodOrderModel.updateMany(
    { _id: { $in: ids } },
    { status },
  );

  return c.json({
    message: "Төлөв шинэчлэгдлээ",
    modifiedCount: result.modifiedCount,
  });
};
