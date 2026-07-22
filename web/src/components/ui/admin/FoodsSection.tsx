import { CreatFoodDialog } from "./createFoodDialog";
type FoodsSectionProps = {
  categoryName: string;
  foods: any[];
  categoryId: string;
  getFoods: () => void;
};
export const FoodsSection = ({
  categoryName,
  foods,
  categoryId,
  getFoods,
}: FoodsSectionProps) => {
  const filterFoods = foods.filter((food) => food.category === categoryId);
  return (
    <div className="w-full rounded-xl  bg-white p-2 flex   flex flex-col">
      <div>
        <h3 className="mb-2 font-semibold text-[20px]">{categoryName}</h3>
      </div>
      <div className="flex gap-5 p-[20px]">
        <CreatFoodDialog categoryId={categoryId} getFoods={getFoods} />
        {filterFoods.map((food) => (
          <div
            key={food._id}
            className=" rounded-xl border w-[270px] flex flex-col p-[16px] "
          >
            <img
              src={food.image}
              alt=""
              className="w-[238px] rounded-xl h-[129px] "
            />

            <div className="flex justify-between">
              <p className="text-red-700">{food.foodName}</p>
              <p>{food.price}</p>
            </div>
            <p className="text-[16px]">{food.ingredients}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodsSection;
