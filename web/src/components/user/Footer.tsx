import Image from "next/image";

const LINK_GROUPS = [
  {
    title: "NOMNOM",
    links: ["Home", "Contact us", "Delivery zone"],
  },
  {
    title: "MENU",
    links: [
      "Appetizers",
      "Salads",
      "Pizzas",
      "Lunch favorites",
      "Main dishes",
    ],
  },
  {
    title: "",
    links: ["Side dish", "Brunch", "Desserts", "Beverages", "Fish & Sea foods"],
  },
];

export const Footer = () => {
  return (
    <footer className="mt-10 bg-[#0a0a0a] text-white">
      <div className="overflow-hidden bg-[#ef4444] py-3">
        <div className="marquee-track flex w-max">
          {/* Хоёр ижил хуулбар — нэг нь дэлгэцээс гарахад нөгөө нь орж
              ирснээр гүйлт тасралтгүй үргэлжилнэ. Нэг хуулбар нь дэлгэцээс
              өргөн байх ёстой, эс бөгөөс төгсгөлд хоосон зай гарна. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 gap-14 pr-14 text-sm text-white"
            >
              {Array.from({ length: 16 }).map((_, index) => (
                <li key={index} className="whitespace-nowrap">
                  Fresh fast delivered
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-wrap gap-10 px-4 py-14 md:px-14">
        <div className="flex items-center gap-2">
          <Image src="/zurag.svg" alt="" width={30} height={24} />
          <div className="leading-tight">
            <p className="text-lg font-semibold">
              Nom<span className="text-[#ef4444]">Nom</span>
            </p>
            <p className="text-[10px] text-white/60">Swift delivery</p>
          </div>
        </div>

        {LINK_GROUPS.map((group, index) => (
          <div key={index} className="flex min-w-[140px] flex-col gap-3">
            <p className="text-xs text-white/50">{group.title}</p>
            {group.links.map((link) => (
              <span key={link} className="text-sm text-white/80">
                {link}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1440px] border-t border-white/10 px-4 py-6 text-xs text-white/50 md:px-14">
        Copyright 2024 © Nomnom LLC
      </div>
    </footer>
  );
};
