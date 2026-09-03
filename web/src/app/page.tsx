"use client";

import { useEffect, useState } from "react";

import type { CategoryType, FoodType } from "@/common/common";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/user/Footer";
import { FoodCard } from "@/components/user/FoodCard";
import { Header } from "@/components/user/Header";
import { HeroBanner } from "@/components/user/HeroBanner";

const Page = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryResponse, foodResponse] = await Promise.all([
          api.get<{ foodCategories: CategoryType[] }>("/category"),
          api.get<{ foods: FoodType[] }>("/food"),
        ]);
        setCategories(categoryResponse.data.foodCategories ?? []);
        setFoods(foodResponse.data.foods ?? []);
      } catch {
        setError(
          "Мэдээлэл ачаалахад алдаа гарлаа. Сервер асаалттай эсэхийг шалгана уу.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sections = categories
    .map((category) => ({
      category,
      items: foods.filter((food) => food.category === category._id),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#404040]">
      <Header />
      <HeroBanner />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 md:px-14">
        {error && (
          <p className="mt-6 rounded-xl bg-white p-4 text-sm text-[#ef4444]">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[340px] rounded-xl bg-white/10"
              />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <p className="py-12 text-center text-white/60">Хоол алга байна.</p>
        ) : (
          sections.map(({ category, items }) => (
            <section key={category._id} className="pt-2 pb-8">
              <h2 className="mb-6 text-2xl font-semibold text-white">
                {category.categoryName}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
