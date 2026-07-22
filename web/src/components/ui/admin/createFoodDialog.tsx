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
import axios from "axios";
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
    const response = await axios.post("http://localhost:3000/food", {
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
      <DialogTrigger className="border w-[270px] h-[241px] rounded-[20px] border-dashed border-red-600">
        {" "}
        <Button className="rounded-full bg-red-600 p-2">
          <Plus size={20} />
        </Button>
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
