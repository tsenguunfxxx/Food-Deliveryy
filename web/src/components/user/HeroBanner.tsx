"use client";

import Image from "next/image";
import { useState } from "react";

export const HeroBanner = () => {
  const [failed, setFailed] = useState(false);

  return (
    <section className="mx-auto w-full max-w-[1440px]">
      {/* Харьцаа нь эх баннерынх (1999×928) — зураг ачаалагдах хүртэл
          байрлал үсрэхээс сэргийлнэ. Зураг байхгүй бол эвдэрсэн дүрс
          үзүүлэхийн оронд чимээгүй хоосон талбай үлдээнэ. */}
      <div className="relative aspect-[1999/928] w-full overflow-hidden  bg-[#f7ece7]">
        {!failed && (
          <Image
            src="/Hero.png"
            alt="Today's offer — Steak Society"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </section>
  );
};
