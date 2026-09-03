import type { CategoryType, FoodType } from "@/common/common";
import AddCategoryDialog from "@/components/ui/admin/AddCategoryDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type MenuHeaderProps = {
  loading: boolean;
  categories: CategoryType[];
  foods: FoodType[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  getCategories: () => void;
};

export const MenuHeader = ({
  loading,
  categories,
  foods,
  activeCategory,
  onSelectCategory,
  getCategories,
}: MenuHeaderProps) => {
  if (loading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  const chipClass = (active: boolean) =>
    `flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
      active ? "border-[#ef4444] bg-[#ef4444] text-white" : "bg-white"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onSelectCategory("all")}
        className={chipClass(activeCategory === "all")}
      >
        All Dishes
        <Badge variant={activeCategory === "all" ? "secondary" : "default"}>
          {foods.length}
        </Badge>
      </button>

      {categories.map((category) => {
        const count = foods.filter(
          (food) => food.category === category._id,
        ).length;

        return (
          <button
            key={category._id}
            type="button"
            onClick={() => onSelectCategory(category._id)}
            className={chipClass(activeCategory === category._id)}
          >
            {category.categoryName}
            <Badge
              variant={
                activeCategory === category._id ? "secondary" : "default"
              }
            >
              {count}
            </Badge>
          </button>
        );
      })}

      <AddCategoryDialog getCategories={getCategories} />
    </div>
  );
};
