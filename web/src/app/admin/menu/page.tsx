"use client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Coins, Plus, TextAlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import AddCategoryDialog from "@/components/ui/admin/AddCategoryDialog";
import FoodsSection from "@/components/ui/admin/FoodsSection";
import { MenuHeader } from "./MenuHeader";
type categoryType = {
  categoryName: string;
  _id: string;
};
const Page = () => {
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const getCategories = async () => {
    setLoading(true);
    const response = await axios.get("http://localhost:3000/category");
    console.log("irj bga hariu", response);
    setCategories(response.data.foodCategories);
    setLoading(false);
  };
  const getFoods = async () => {
    const response = await axios.get("http://localhost:3000/food  ");
    console.log("FOODS RESPONCE", response);
    setFoods(response.data.foods);
  };
  useEffect(() => {
    getCategories();
    getFoods();
  }, []);

  return (
    <div className="h-screen w-full flex">
      <div className="h-[1024px] w-[205px] py-9 px-5 flex flex-col gap-[40px]">
        <div className="flex w-[165px] h-[44px] items-center gap-2 ">
          <Image src="/zurag.svg" alt="" width={36} height={29} />{" "}
          <div>
            <h1 className="text-black text-xl font-semibold">NomNom</h1>
            <h3 className="text-gray-400">Swift delivery</h3>
          </div>
        </div>{" "}
        <div className="flex flex-col gap-[24px] items-center px-6 py-0 h-[104px]">
          <Button className="px-6 py-0 rounded-full gap-[10px]">
            {" "}
            <TextAlignJustify />
            Food Menu
          </Button>
          <Button className="bg-gray-50 px-6 rounded-full ">
            {" "}
            <Truck className="text-black w-[18px] h-[13px]" />
            <h2 className="text-black">Orders</h2>
          </Button>
        </div>
      </div>
      <div className="w-full rounded-xl p-6 space-y-4 bg-gray-100 p-6">
        <div>
          <h3 className="text-black text-xl font-semibold">Dishes Category</h3>
          <MenuHeader
            getCategories={getCategories}
            categories={categories}
            loading={loading}
          />
        </div>
        {categories?.map((category) => {
          return (
            <FoodsSection
              getFoods={getFoods}
              foods={foods}
              categoryName={category.categoryName}
              categoryId={category._id}
            ></FoodsSection>
          );
        })}
      </div>
    </div>
  );
};
export default Page;
