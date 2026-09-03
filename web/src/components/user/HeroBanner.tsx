import Image from "next/image";

export const HeroBanner = () => {
  return (
    <section className="mx-auto w-full max-w-[1440px] ">
      {/* Харьцаа нь эх баннерынх (1999×928) — зураг ачаалагдах хүртэл
          байрлал үсрэхээс сэргийлнэ. */}
      <div className="relative aspect-[1999/928] w-full overflow-hidden  bg-[#f7ece7]">
        <Image
          src="/hero.png"
          alt="Today's offer — Steak Society"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover"
        />
      </div>
    </section>
  );
};
