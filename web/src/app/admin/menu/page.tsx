"use client";

import { useEffect, useState } from "react";

import type { CategoryType, FoodType } from "@/common/common";
import { api } from "@/lib/api";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { EditFoodDialog } from "@/components/ui/admin/EditFoodDialog";
import FoodsSection from "@/components/ui/admin/FoodsSection";
import { MenuHeader } from "./MenuHeader";

const Page = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [editingFood, setEditingFood] = useState<FoodType | null>(null);

  const getCategories = async () => {
    const response = await api.get<{ foodCategories: CategoryType[] }>(
      "/category",
    );
    setCategories(response.data.foodCategories ?? []);
  };

  const getFoods = async () => {
    const response = await api.get<{ foods: FoodType[] }>("/food");
    setFoods(response.data.foods ?? []);
  };

  const loadAll = async () => {
    try {
      await Promise.all([getCategories(), getFoods()]);
    } catch {
      setError("Мэдээлэл ачаалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((category) => category._id === activeCategory);

  return (
    <AdminGuard>
      <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
        <AdminSidebar />

        <main className="flex-1 space-y-5 bg-gray-100 p-6">
          <div className="space-y-4 rounded-xl bg-white p-5">
            <h1 className="text-xl font-semibold">Dishes category</h1>
            <MenuHeader
              loading={loading}
              categories={categories}
              foods={foods}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              getCategories={getCategories}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-white p-4 text-sm text-[#ef4444]">
              {error}
            </p>
          )}

          {visibleCategories.map((category) => (
            <FoodsSection
              key={category._id}
              categoryName={category.categoryName}
              categoryId={category._id}
              categories={categories}
              foods={foods}
              getFoods={getFoods}
              onEdit={setEditingFood}
            />
          ))}
        </main>

        <EditFoodDialog
          food={editingFood}
          categories={categories}
          onOpenChange={(open) => {
            if (!open) setEditingFood(null);
          }}
          onSaved={getFoods}
        />
      </div>
    </AdminGuard>
  );
};

export default Page;
