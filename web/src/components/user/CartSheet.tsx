"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import type { OrderType } from "@/common/common";
import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const SHIPPING = 0.99;

export const CartSheet = () => {
  const {
    items,
    address,
    itemsTotal,
    count,
    setAddress,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"cart" | "order">("cart");
  const [addressDraft, setAddressDraft] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await api.get<{ orders: OrderType[] }>("/order");
      setOrders(response.data.orders ?? []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (open && tab === "order" && user) loadOrders();
  }, [open, tab, user]);

  const handleCheckout = async () => {
    setError("");

    if (!user) {
      setError("Захиалга өгөхийн тулд эхлээд нэвтэрнэ үү.");
      return;
    }
    if (items.length === 0) {
      setError("Сагс хоосон байна.");
      return;
    }
    if (!addressDraft.trim()) {
      setError("Хүргэлтийн хаягаа оруулна уу.");
      return;
    }

    setPlacing(true);
    try {
      setAddress(addressDraft.trim());
      await api.post<{ order: OrderType }>("/order", {
        deliveryAddress: addressDraft.trim(),
        foodOrderItems: items.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setOpen(false);
      setSuccess(true);
    } catch (err) {
      setError(
        getErrorMessage(err, "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу."),
      );
    } finally {
      setPlacing(false);
    }
  };

  const total = itemsTotal + (items.length > 0 ? SHIPPING : 0);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (next) setAddressDraft(address);
          setOpen(next);
        }}
      >
        <SheetTrigger asChild>
          <Button
            size="icon"
            aria-label="Сагс"
            className="relative size-9 rounded-full bg-[#2f2f2f] text-white hover:bg-[#3d3d3d]"
          >
            <ShoppingCart className="size-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Order detail
          </SheetTitle>

          <div className="flex gap-2 rounded-full bg-white p-1">
            <button
              type="button"
              onClick={() => setTab("cart")}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                tab === "cart" ? "bg-[#ef4444] text-white" : "text-black"
              }`}
            >
              Cart
            </button>
            <button
              type="button"
              onClick={() => setTab("order")}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                tab === "order" ? "bg-[#ef4444] text-white" : "text-black"
              }`}
            >
              Order
            </button>
          </div>

          {tab === "cart" ? (
            <div className="flex flex-col gap-6">
              <section className="rounded-xl bg-white p-4 text-black">
                <p className="mb-4 text-xl font-semibold">My cart</p>

                {items.length === 0 ? (
                  <p className="py-8 text-center text-sm text-black/60">
                    Таны сагс хоосон байна.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <div key={item.food._id} className="flex gap-3">
                        <img
                          src={item.food.image}
                          alt={item.food.foodName}
                          className="size-[124px] shrink-0 rounded-xl object-cover"
                        />
                        <div className="flex flex-1 flex-col justify-between gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-[#ef4444]">
                                {item.food.foodName}
                              </p>
                              <p className="text-xs text-black/60">
                                {item.food.ingredients}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Устгах"
                              className="text-[#ef4444]"
                              onClick={() => removeItem(item.food._id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon-xs"
                                aria-label="Хасах"
                                className="rounded-full"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  setQuantity(item.food._id, item.quantity - 1)
                                }
                              >
                                <Minus />
                              </Button>
                              <span className="w-5 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon-xs"
                                aria-label="Нэмэх"
                                className="rounded-full"
                                onClick={() =>
                                  setQuantity(item.food._id, item.quantity + 1)
                                }
                              >
                                <Plus />
                              </Button>
                            </div>
                            <p className="font-semibold">
                              ${(item.food.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl bg-white p-4 text-black">
                <p className="mb-2 text-xl font-semibold">Delivery location</p>
                <textarea
                  value={addressDraft}
                  onChange={(event) => setAddressDraft(event.target.value)}
                  placeholder="Please share your complete address"
                  className="min-h-[84px] w-full resize-none rounded-md border border-black/15 p-3 text-sm outline-none focus:border-black/40"
                />
              </section>

              <section className="rounded-xl bg-white p-4 text-black">
                <p className="mb-4 text-xl font-semibold">Payment info</p>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-black/60">Items</dt>
                    <dd className="font-semibold">${itemsTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-black/60">Shipping</dt>
                    <dd className="font-semibold">
                      ${items.length > 0 ? SHIPPING.toFixed(2) : "0.00"}
                    </dd>
                  </div>
                  <div className="my-1 border-t border-dashed border-black/20" />
                  <div className="flex justify-between text-base">
                    <dt className="text-black/60">Total</dt>
                    <dd className="font-semibold">${total.toFixed(2)}</dd>
                  </div>
                </dl>
              </section>

              {error && (
                <p className="rounded-md bg-[#ef4444]/20 p-3 text-sm text-white">
                  {error}
                </p>
              )}

              {user ? (
                <Button
                  onClick={handleCheckout}
                  disabled={placing || items.length === 0}
                  className="h-11 w-full rounded-full bg-[#ef4444] text-white hover:bg-[#ef4444]/90"
                >
                  {placing ? "Илгээж байна..." : "Checkout"}
                </Button>
              ) : (
                <div className="flex flex-col gap-2 rounded-xl bg-white p-4 text-black">
                  <p className="font-semibold">You need to login first</p>
                  <p className="text-sm text-black/60">
                    Захиалга өгөхийн тулд бүртгэлдээ нэвтэрнэ үү.
                  </p>
                  <Button
                    asChild
                    onClick={() => setOpen(false)}
                    className="h-11 w-full rounded-full bg-[#ef4444] text-white hover:bg-[#ef4444]/90"
                  >
                    <Link href="/signedIn">Log in</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xl font-semibold">Order history</p>

              {!user ? (
                <p className="text-sm text-white/70">
                  Захиалгын түүхээ харахын тулд нэвтэрнэ үү.
                </p>
              ) : ordersLoading ? (
                <p className="text-sm text-white/70">Ачаалж байна...</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-white/70">
                  Танд захиалгын түүх алга байна.
                </p>
              ) : (
                orders.map((order) => (
                  <article
                    key={order._id}
                    className="rounded-xl bg-white p-4 text-black"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                      <span className="rounded-full border px-3 py-1 text-xs">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-black/60">
                      {new Date(order.createdAt).toLocaleString("mn-MN")}
                    </p>
                    <ul className="mt-3 flex flex-col gap-1 text-sm">
                      {order.foodOrderItems.map((item, index) => (
                        <li
                          key={`${order._id}-${index}`}
                          className="flex justify-between"
                        >
                          <span>{item.food?.foodName ?? "Устсан хоол"}</span>
                          <span className="text-black/60">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-black/60">
                      {order.deliveryAddress}
                    </p>
                  </article>
                ))
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle className="text-center">
            Your order has been successfully placed!
          </DialogTitle>
          <Button
            onClick={() => setSuccess(false)}
            className="h-11 w-full rounded-full bg-[#ef4444] text-white hover:bg-[#ef4444]/90"
          >
            Back to home
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
