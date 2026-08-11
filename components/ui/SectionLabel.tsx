import { cn } from "@/lib/utils";

/**
 * Har bir bo'lim tepasidagi yorliq: 24×1 feruza chiziq + "02 / ВОПРОСЫ..."
 * Figma: Inter Bold 10px, tracking 1.5px, uppercase, #527370.
 */
export function SectionLabel({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  /** `dark` — qorong'i fon ustida (matn oqroq bo'ladi). */
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-[9px] text-[10px] font-bold tracking-[0.15em] uppercase",
        tone === "dark" ? "text-white/70" : "text-label",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 shrink-0 bg-accent" />
      {children}
    </p>
  );
}
