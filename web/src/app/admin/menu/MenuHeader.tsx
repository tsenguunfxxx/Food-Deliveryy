import { CategoryType } from "@/common/common";
import AddCategoryDialog from "@/components/ui/admin/AddCategoryDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type MenuHeaderProps = {
  loading: boolean;
  categories: CategoryType[];
  getCategories: () => void;
};

export const MenuHeader = ({
  loading,
  categories,
  getCategories,
}: MenuHeaderProps) => {
  if (loading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center flex-wrap">
      {categories.map((category) => (
        <div
          key={category._id}
          className="rounded-full py-2 px-4 border flex items-center"
        >
          {category.categoryName}
          <Badge className="ml-2">5</Badge>
        </div>
      ))}

      <AddCategoryDialog getCategories={getCategories} />
    </div>
  );
};
