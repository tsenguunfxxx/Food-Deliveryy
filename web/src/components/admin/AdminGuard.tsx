"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

/** Админ бус хэрэглэгчид админ хуудсыг үзүүлэхгүй. */
export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { ready, user, isAdmin } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-black/50">
        Ачаалж байна...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Админ эрх шаардлагатай</h1>
          <p className="mt-2 text-sm text-black/60">
            {user
              ? `${user.email} хаяг админ эрхгүй байна.`
              : "Энэ хуудсыг үзэхийн тулд админаар нэвтэрнэ үү."}
          </p>
        </div>
        <Button
          asChild
          className="rounded-full bg-[#ef4444] px-6 text-white hover:bg-[#ef4444]/90"
        >
          <Link href={user ? "/" : "/signedIn"}>
            {user ? "Нүүр хуудас" : "Log in"}
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
