"use client";

import Image from "next/image";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { PlayIcon } from "@/components/ui/icons";
import { VIDEO_URL } from "@/lib/site-config";
import { CONTAINER, SECTION_PB } from "@/lib/utils";

/**
 * Figma node 261:2503 — ishlab chiqarish maydonchasi videosi.
 * Maketda rasm 1205×804 o'lchamda (−12, −63) da, ya'ni bo'limdan kattaroq va
 * kesilgan; ustiga feruza tus berilgan, markazda 73px oq play tugmasi.
 *
 * Video manzili (`VIDEO_URL`) sozlanmagan bo'lsa — bosiladigan tugma
 * chizilmaydi: ishlamaydigan boshqaruv elementi qoldirilmaydi.
 */
export function VideoBlock() {
  const { t } = useLanguage();

  const media = (
    <>
      <Image
        src="/images/video-poster.jpg"
        alt={t.video.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 1180px"
        className="scale-[1.021] object-cover object-center brightness-[1.12]"
      />

      {/* maketdagi feruza tus (duotone) */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[#12706e] opacity-90 mix-blend-color"
      />

      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 grid size-[56px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-transform group-hover:scale-105 lg:size-[73px]"
      >
        <PlayIcon className="ml-[3px] w-[20px] text-[#123232] lg:w-[26px]" />
      </span>
    </>
  );

  const frame = "group relative block aspect-[1180/677] w-full overflow-hidden rounded-[32px]";

  return (
    <section id="video" className={`${SECTION_PB} lg:pb-[96px]`}>
      <div className={CONTAINER}>
        {VIDEO_URL ? (
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t.video.play}
            className={`${frame} cursor-pointer`}
          >
            {media}
          </a>
        ) : (
          // TODO: video manzili `lib/site-config.ts` dagi VIDEO_URL ga yozilsa,
          // bu blok avtomatik bosiladigan havolaga aylanadi.
          <figure className={frame}>{media}</figure>
        )}
      </div>
    </section>
  );
}
