"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import type { FoodType } from "@/common/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";

export const FoodCard = ({ food }: { food: FoodType }) => {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(food, quantity);
    setOpen(false);
    setQuantity(1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuantity(1);
      }}
    >
      <Card className="relative bg-white text-left ring-0 transition-shadow has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-[#ef4444] hover:shadow-lg">
        <div className="relative px-4 pt-4">
          <img
            src={food.image}
            alt={food.foodName}
            className="h-[210px] w-full rounded-xl object-cover"
          />
          <span className="absolute right-7 bottom-3 flex size-11 items-center justify-center rounded-full bg-white shadow-md">
            <Plus className="size-5 text-[#ef4444]" />
          </span>
        </div>

        <CardContent className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-lg font-semibold text-[#ef4444]">
              {food.foodName}
            </p>
            <p className="font-semibold whitespace-nowrap tabular-nums">
              ${food.price}
            </p>
          </div>
          <p className="text-sm text-black/60">{food.ingredients}</p>
        </CardContent>

        {/* Картыг бүхэлд нь дарагдахаар болгосон жинхэнэ товч —
              гар талбараас ч ажиллана. */}
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`${food.foodName} дэлгэрэнгүй`}
            className="absolute inset-0 cursor-pointer rounded-xl outline-none"
          />
        </DialogTrigger>
      </Card>

      <DialogContent className="max-w-[826px] sm:max-w-[826px]">
        <DialogTitle className="sr-only">{food.foodName}</DialogTitle>
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={food.image}
            alt={food.foodName}
            className="h-[220px] w-full rounded-xl object-cover md:h-[280px] md:w-[377px]"
          />

          <div className="flex flex-1 flex-col justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-semibold text-[#ef4444]">
                {food.foodName}
              </p>
              <p className="text-sm text-black/70">{food.ingredients}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/60">Total price</p>
                  <p className="text-2xl font-semibold">
                    ${(food.price * quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Хасах"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus />
                  </Button>
                  <span className="w-6 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Нэмэх"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAdd}
                className="h-11 w-full rounded-full bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/90"
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
