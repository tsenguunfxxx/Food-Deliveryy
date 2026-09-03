"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import type { CategoryType, FoodType } from "@/common/common";
import { api, getErrorMessage } from "@/lib/api";
import { uploadFile } from "@/lib/uploadFile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type EditFoodDialogProps = {
  food: FoodType | null;
  categories: CategoryType[];
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export const EditFoodDialog = ({
  food,
  categories,
  onOpenChange,
  onSaved,
}: EditFoodDialogProps) => {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Сонгосон хоол солигдох бүрд формыг шинэчилнэ.
  useEffect(() => {
    if (!food) return;
    setFoodName(food.foodName ?? "");
    setPrice(String(food.price ?? ""));
    setIngredients(food.ingredients ?? "");
    setCategory(food.category ?? "");
    setFile(null);
    setError("");
  }, [food]);

  const handleSave = async () => {
    if (!food) return;
    setError("");

    if (!foodName.trim()) {
      setError("Хоолны нэрээ оруулна уу.");
      return;
    }

    setSaving(true);
    try {
      const image = file ? await uploadFile(file) : food.image;
      await api.put(`/food/${food._id}`, {
        foodName: foodName.trim(),
        price: Number(price),
        ingredients,
        category,
        image,
      });
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(getErrorMessage(err, "Хадгалахад алдаа гарлаа"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!food) return;
    setError("");
    setDeleting(true);
    try {
      await api.delete(`/food/${food._id}`);
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(getErrorMessage(err, "Устгахад алдаа гарлаа"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={Boolean(food)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dishes info</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Dish name
            <Input
              value={foodName}
              onChange={(event) => setFoodName(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Dish category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-9 rounded-md border border-black/15 px-3 text-sm outline-none focus:border-black/40"
            >
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.categoryName}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Ingredients
            <textarea
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              className="min-h-[80px] resize-none rounded-md border border-black/15 p-3 text-sm outline-none focus:border-black/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Price
            <Input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>

          <div className="flex flex-col gap-1 text-sm">
            Image
            {food?.image && !file && (
              <img
                src={food.image}
                alt=""
                className="h-[120px] w-full rounded-md object-cover"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <span className="text-xs text-black/50">
              Шинэ зураг сонгоогүй бол хуучин зураг хэвээр үлдэнэ.
            </span>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || saving}
              aria-label="Хоол устгах"
            >
              <Trash2 className="size-4" />
              {deleting ? "Устгаж байна..." : "Delete"}
            </Button>

            <Button onClick={handleSave} disabled={saving || deleting}>
              {saving ? "Хадгалж байна..." : "Save changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
