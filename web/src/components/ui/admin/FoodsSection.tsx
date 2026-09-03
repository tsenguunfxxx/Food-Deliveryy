import type { CategoryType, FoodType } from "@/common/common";
import { CreatFoodDialog } from "./createFoodDialog";

type FoodsSectionProps = {
  categoryName: string;
  foods: FoodType[];
  categoryId: string;
  categories: CategoryType[];
  getFoods: () => void;
  onEdit: (food: FoodType) => void;
};

export const FoodsSection = ({
  categoryName,
  foods,
  categoryId,
  getFoods,
  onEdit,
}: FoodsSectionProps) => {
  const filterFoods = foods.filter((food) => food.category === categoryId);

  return (
    <section className="flex w-full flex-col rounded-xl bg-white p-5">
      <h3 className="mb-4 text-xl font-semibold">
        {categoryName}{" "}
        <span className="text-base font-normal text-black/40">
          ({filterFoods.length})
        </span>
      </h3>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreatFoodDialog categoryId={categoryId} getFoods={getFoods} />

        {filterFoods.map((food) => (
          <button
            key={food._id}
            type="button"
            onClick={() => onEdit(food)}
            className="flex flex-col rounded-xl border p-4 text-left transition-shadow hover:shadow-md"
          >
            <img
              src={food.image}
              alt={food.foodName}
              className="h-[129px] w-full rounded-xl object-cover"
            />
            <div className="mt-2 flex justify-between gap-2">
              <p className="font-medium text-[#ef4444]">{food.foodName}</p>
              <p className="whitespace-nowrap">${food.price}</p>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-black/60">
              {food.ingredients}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FoodsSection;
