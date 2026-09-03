export type CategoryType = {
  categoryName: string;
  _id: string;
};
export type FoodType = {
  foodName: string;
  ingredients: string;
  price: number;
  image: string;
  _id: string;
  category: string;
};

export type AuthUser = {
  _id: string;
  email: string;
  role: "ADMIN" | "USER";
  address?: string;
  phoneNumber?: string;
};

export type CartItemType = {
  food: FoodType;
  quantity: number;
};

export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELED";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  DELIVERED: "Delivered",
  CANCELED: "Cancelled",
};

export type OrderType = {
  _id: string;
  user?: { _id: string; email: string } | null;
  totalPrice: number;
  deliveryAddress: string;
  status: OrderStatus;
  createdAt: string;
  foodOrderItems: {
    food: FoodType | null;
    quantity: number;
  }[];
};
