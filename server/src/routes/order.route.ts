import { Hono } from "hono";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
  updateOrdersStatus,
} from "../controllers/order.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const OrderRoute = new Hono();

OrderRoute.post("/", requireAuth, createOrder);
OrderRoute.get("/", requireAuth, getOrders);
OrderRoute.patch("/", requireAuth, requireAdmin, updateOrdersStatus);
OrderRoute.patch("/:id", requireAuth, requireAdmin, updateOrderStatus);

export default OrderRoute;
