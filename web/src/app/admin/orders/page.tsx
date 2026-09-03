"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
  type OrderType,
} from "@/common/common";
import { api } from "@/lib/api";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ChangeStateDialog } from "@/components/admin/ChangeStateDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "border-[#ef4444] text-[#ef4444]",
  DELIVERED: "border-black/20 text-black",
  CANCELED: "border-black/20 text-black/50",
};

const Page = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadOrders = async () => {
    setError("");
    try {
      const response = await api.get<{ orders: OrderType[] }>("/order");
      setOrders(response.data.orders ?? []);
    } catch {
      setError("Захиалга ачаалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const allSelected = useMemo(
    () => orders.length > 0 && selected.length === orders.length,
    [orders, selected],
  );

  const toggleAll = () => {
    setSelected(allSelected ? [] : orders.map((order) => order._id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const changeOneStatus = async (id: string, status: OrderStatus) => {
    const previous = orders;
    setOrders((prev) =>
      prev.map((order) => (order._id === id ? { ...order, status } : order)),
    );
    try {
      await api.patch(`/order/${id}`, { status });
    } catch {
      setOrders(previous);
      setError("Төлөв солиход алдаа гарлаа.");
    }
  };

  const changeSelectedStatus = async (status: OrderStatus) => {
    setSaving(true);
    try {
      await api.patch("/order", { ids: selected, status });
      await loadOrders();
      setSelected([]);
      setDialogOpen(false);
    } catch {
      setError("Төлөв солиход алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
        <AdminSidebar />

        <main className="flex-1 bg-gray-100 p-6">
          <div className="rounded-xl bg-white p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Orders</h1>
                <p className="text-sm text-black/50">{orders.length} items</p>
              </div>

              <Button
                onClick={() => setDialogOpen(true)}
                disabled={selected.length === 0}
                className="rounded-full bg-[#0a0a0a] px-4 text-white hover:bg-[#0a0a0a]/90"
              >
                Change delivery state
                {selected.length > 0 && (
                  <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-[#ef4444] text-[10px]">
                    {selected.length}
                  </span>
                )}
              </Button>
            </div>

            {error && (
              <p className="mb-4 rounded-md bg-[#ef4444]/10 p-3 text-sm text-[#ef4444]">
                {error}
              </p>
            )}

            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p className="py-12 text-center text-sm text-black/50">
                Захиалга алга байна.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-black/50">
                      <th className="w-10 p-3">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={toggleAll}
                          aria-label="Бүгдийг сонгох"
                        />
                      </th>
                      <th className="w-12 p-3 font-medium">№</th>
                      <th className="p-3 font-medium">Customer</th>
                      <th className="p-3 font-medium">Food</th>
                      <th className="p-3 font-medium">Date</th>
                      <th className="p-3 font-medium">Total</th>
                      <th className="p-3 font-medium">Delivery Address</th>
                      <th className="p-3 font-medium">Delivery state</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => {
                      const isExpanded = expanded.includes(order._id);
                      return (
                        <Fragment key={order._id}>
                          <tr className="border-b align-top">
                            <td className="p-3">
                              <Checkbox
                                checked={selected.includes(order._id)}
                                onCheckedChange={() => toggleOne(order._id)}
                                aria-label={`${index + 1}-р захиалгыг сонгох`}
                              />
                            </td>
                            <td className="p-3 text-black/50">{index + 1}</td>
                            <td className="p-3">
                              {order.user?.email ?? "Зочин"}
                            </td>
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => toggleExpanded(order._id)}
                                className="flex items-center gap-1"
                              >
                                {order.foodOrderItems.length} foods
                                {isExpanded ? (
                                  <ChevronUp className="size-4" />
                                ) : (
                                  <ChevronDown className="size-4" />
                                )}
                              </button>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString(
                                "mn-MN",
                              )}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="max-w-[220px] p-3 text-black/70">
                              {order.deliveryAddress}
                            </td>
                            <td className="p-3">
                              <select
                                value={order.status}
                                onChange={(event) =>
                                  changeOneStatus(
                                    order._id,
                                    event.target.value as OrderStatus,
                                  )
                                }
                                aria-label="Хүргэлтийн төлөв"
                                className={`rounded-full border bg-white px-3 py-1 text-xs outline-none ${
                                  STATUS_STYLES[order.status]
                                }`}
                              >
                                {(
                                  Object.keys(
                                    ORDER_STATUS_LABELS,
                                  ) as OrderStatus[]
                                ).map((status) => (
                                  <option key={status} value={status}>
                                    {ORDER_STATUS_LABELS[status]}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="border-b bg-gray-50">
                              <td colSpan={8} className="p-3">
                                <div className="flex flex-wrap gap-4">
                                  {order.foodOrderItems.map(
                                    (item, itemIndex) => (
                                      <div
                                        key={`${order._id}-${itemIndex}`}
                                        className="flex items-center gap-2 rounded-lg border bg-white p-2"
                                      >
                                        {item.food?.image && (
                                          <img
                                            src={item.food.image}
                                            alt=""
                                            className="size-10 rounded object-cover"
                                          />
                                        )}
                                        <span>
                                          {item.food?.foodName ?? "Устсан хоол"}
                                        </span>
                                        <span className="text-black/50">
                                          x{item.quantity}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        <ChangeStateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          count={selected.length}
          saving={saving}
          onSave={changeSelectedStatus}
        />
      </div>
    </AdminGuard>
  );
};

export default Page;
