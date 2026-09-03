"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextAlignJustify, Truck } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/menu", label: "Food menu", icon: TextAlignJustify },
  { href: "/admin/orders", label: "Orders", icon: Truck },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    // Гар утсан дээр дээд тууз, md-ээс дээш босоо хажуу самбар.
    <aside className="flex shrink-0 flex-col gap-4 border-b border-black/10 px-4 py-4 md:w-[205px] md:gap-10 md:border-b-0 md:px-5 md:py-9">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/zurag.svg" alt="" width={36} height={29} />
        <div className="leading-tight">
          <p className="text-xl font-semibold">
            Nom<span className="text-[#ef4444]">Nom</span>
          </p>
          <p className="text-xs text-gray-400">Swift delivery</p>
        </div>
      </Link>

      <nav className="flex gap-2 md:flex-col md:gap-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors md:flex-none md:justify-start md:px-6 ${
                active
                  ? "bg-[#0a0a0a] text-white"
                  : "bg-gray-50 text-black hover:bg-gray-100"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
