"use client";

import { useState } from "react";

import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/common/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUSES: OrderStatus[] = ["DELIVERED", "PENDING", "CANCELED"];

type ChangeStateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  saving: boolean;
  onSave: (status: OrderStatus) => void;
};

export const ChangeStateDialog = ({
  open,
  onOpenChange,
  count,
  saving,
  onSave,
}: ChangeStateDialogProps) => {
  const [selected, setSelected] = useState<OrderStatus>("DELIVERED");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] sm:max-w-[400px]">
        <DialogTitle>Change delivery state</DialogTitle>
        <p className="text-sm text-black/60">
          {count} захиалгын төлөв өөрчлөгдөнө.
        </p>

        <div className="flex gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelected(status)}
              className={`flex-1 rounded-full border px-3 py-2 text-sm transition-colors ${
                selected === status
                  ? "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]"
                  : "border-black/15 text-black"
              }`}
            >
              {ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <Button
          onClick={() => onSave(selected)}
          disabled={saving}
          className="h-11 w-full rounded-full bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/90"
        >
          {saving ? "Хадгалж байна..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
