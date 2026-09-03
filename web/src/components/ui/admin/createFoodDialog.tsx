import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../input";
import { Button } from "../button";
import { useState } from "react";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";
export const CreatFoodDialog = ({
  categoryId,
  getFoods,
}: {
  categoryId: string;
  getFoods: () => void;
}) => {
  const [foodName, setFoodName] = useState();
  const [price, setPrice] = useState();
  const [ingredients, setIngerdients] = useState();
  const [file, setFile] = useState<File>();
  const handleFoodName = (e: any) => {
    const { value } = e.target;
    setFoodName(value);
  };
  const handlePrice = (e: any) => {
    const { value } = e.target;
    setPrice(value);
  };
  const handleIngerdients = (e: any) => {
    const { value } = e.target;
    setIngerdients(value);
  };
  const handleFile = (e: any) => {
    const uploadedFile = e.target.files[0];

    setFile(uploadedFile);
  };
  const CreateFood = async () => {
    if (!file) {
      console.log("ZURGAA ORUULNA UU");
      return;
    }
    const imageUrl = await uploadFile(file);
    const response = await api.post("/food", {
      foodName: foodName,
      price: price,
      ingredients: ingredients,
      category: categoryId,
      image: imageUrl,
    });
    getFoods();
  };
  return (
    <Dialog>
      <DialogTrigger className="flex min-h-[241px] flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-red-600 p-4 transition-colors hover:bg-red-50">
        <span className="flex size-10 items-center justify-center rounded-full bg-red-600 text-white">
          <Plus size={20} />
        </span>
        <span className="text-sm font-medium">Add new Dish</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Food </DialogTitle>
        </DialogHeader>
        <div>
          <p>Food name</p>{" "}
          <Input onChange={handleFoodName} type="text" name="" id="" />
        </div>{" "}
        <div>
          <p>Price</p>{" "}
          <Input onChange={handlePrice} type="Number" name="" id="" />
        </div>
        <div>
          <p>ingredients</p>{" "}
          <Input onChange={handleIngerdients} type="text" name="" id="" />
        </div>
        <div>
          <p>Image</p>
          <Input onChange={handleFile} type="file" />
        </div>
        <DialogClose asChild>
          <Button onClick={CreateFood}>Add Food</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
