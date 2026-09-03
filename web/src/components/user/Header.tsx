"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CartSheet } from "./CartSheet";

export const Header = () => {
  const { address } = useCart();
  const { user, ready, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a] text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 md:px-14">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/zurag.svg" alt="" width={30} height={24} />
          <div className="leading-tight">
            <p className="text-lg font-semibold">
              Nom<span className="text-[#ef4444]">Nom</span>
            </p>
            <p className="text-[10px] text-white/60">Swift delivery</p>
          </div>
        </Link>

        {!ready ? null : user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-[#ef4444] px-3 py-2 text-xs text-white sm:px-4">
              <MapPin className="size-4 shrink-0" />
              <span className="hidden sm:inline">Delivery address:</span>
              <span className="max-w-[140px] truncate text-white/80">
                {address || "Add Location"}
              </span>
            </div>

            <CartSheet />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Хэрэглэгчийн цэс"
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Avatar className="size-9 bg-[#2f2f2f]">
                    <AvatarFallback className="bg-[#2f2f2f] text-white">
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="truncate px-2 py-1.5 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/orders">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={signOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CartSheet />
            <Button
              asChild
              className="rounded-full bg-white/10 px-4 text-white hover:bg-white/20"
            >
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#ef4444] px-4 text-white hover:bg-[#ef4444]/90"
            >
              <Link href="/signedIn">Log in</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
