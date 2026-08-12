"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { PlayIcon } from "@/components/ui/icons";
import { VIDEO_URL } from "@/lib/site-config";
import { CONTAINER, SECTION_PB } from "@/lib/utils";

/** `youtu.be/<id>`, `youtube.com/watch?v=<id>` yoki `vimeo.com/<id>` → o'rnatiladigan (embed) URL. */
function toEmbedUrl(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  if (u.hostname === "youtu.be") {
    return `https://www.youtube.com/embed${u.pathname}?autoplay=1&rel=0`;
  }
  if (u.hostname.includes("youtube.com")) {
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    if (u.pathname.startsWith("/embed/")) {
      return `https://www.youtube.com${u.pathname}?autoplay=1&rel=0`;
    }
  }
  if (u.hostname.includes("vimeo.com")) {
    const id = u.pathname.split("/").filter(Boolean).pop();
    if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return null;
}

/**
 * Figma node 261:2503 — ishlab chiqarish maydonchasi videosi.
 * Maketda rasm 1205×804 o'lchamda (−12, −63) da, ya'ni bo'limdan kattaroq va
 * kesilgan; ustiga feruza tus berilgan, markazda 73px oq play tugmasi.
 *
 * Video manzili (`VIDEO_URL`) sozlanmagan bo'lsa — bosiladigan tugma
 * chizilmaydi: ishlamaydigan boshqaruv elementi qoldirilmaydi. YouTube/Vimeo
 * havolasi bo'lsa, bosilganda sahifadan chiqmasdan, modal oynada o'ynatiladi.
 */
export function VideoBlock() {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);

  const embedUrl = VIDEO_URL ? toEmbedUrl(VIDEO_URL) : null;

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setPlaying(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    setPlaying(true);
    dialogRef.current?.showModal();
  };

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
          embedUrl ? (
            <button type="button" onClick={open} aria-label={t.video.play} className={`${frame} cursor-pointer`}>
              {media}
            </button>
          ) : (
            // Embed'ga o'girib bo'lmaydigan havola — yangi oynada ochiladi.
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.video.play}
              className={`${frame} cursor-pointer`}
            >
              {media}
            </a>
          )
        ) : (
          // TODO: video manzili `lib/site-config.ts` dagi VIDEO_URL ga yozilsa,
          // bu blok avtomatik bosiladigan havolaga aylanadi.
          <figure className={frame}>{media}</figure>
        )}

        {VIDEO_URL && (
          <p className="mt-4 text-center text-[12px] font-semibold text-label">
            {t.video.caption}
          </p>
        )}
      </div>

      {embedUrl && (
        <dialog
          ref={dialogRef}
          aria-label={t.video.play}
          onClick={(e) => {
            if (e.target === dialogRef.current) close();
          }}
          className="m-auto w-[min(94vw,1100px)] overflow-hidden rounded-[24px] bg-black p-0 backdrop:bg-ink-deep/85"
        >
          {playing && (
            <div className="relative aspect-video w-full">
              <button
                type="button"
                onClick={close}
                aria-label={t.video.close}
                className="absolute top-3 right-3 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                ✕
              </button>
              <iframe
                src={embedUrl}
                title={t.video.alt}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          )}
        </dialog>
      )}
    </section>
  );
}
