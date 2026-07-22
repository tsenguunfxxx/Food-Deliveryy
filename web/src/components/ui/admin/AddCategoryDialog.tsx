"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../button";
import { Plus } from "lucide-react";
import { Input } from "../input";
import { useState } from "react";
import axios from "axios";

type AddCategoryDialogProps = {
  getCategories: () => void;
};

const AddCategoryDialog = ({ getCategories }: AddCategoryDialogProps) => {
  const [value, setValue] = useState("");

  const addNewCategory = async () => {
    if (!value.trim()) return;

    try {
      await axios.post("http://localhost:3000/category", {
        categoryName: value,
      });

      await getCategories();
      setValue("");
    } catch (error) {
      console.error("Category add error:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-red-600 p-2">
          <Plus size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p>Category Name</p>

          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type new category name..."
          />

          <DialogClose asChild>
            <Button onClick={addNewCategory}>Add</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
