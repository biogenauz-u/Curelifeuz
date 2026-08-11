"use client";

import { Image } from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

import { uploadEditorImage } from "@/app/admin/upload-actions";

const BTN =
  "grid h-8 min-w-8 cursor-pointer place-items-center rounded-[8px] border px-2 text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35";
const BTN_OFF = "border-transparent text-ink-deep hover:bg-brand-100/50";
const BTN_ON = "border-accent bg-brand-100/70 text-brand-700";

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`${BTN} ${active ? BTN_ON : BTN_OFF}`}
      title={label}
    >
      {children}
    </button>
  );
}

/**
 * Word'ga o'xshash rich-text muharrir — maqola matni uchun.
 * Qalin/kursiv, sarlavhalar, ro'yxatlar, havola, rasm va jadvalni qo'llab-quvvatlaydi.
 *
 * Nazoratli komponent: `value`/`onChange` orqali ishlaydi (masalan AI to'ldirish
 * yoki tarjima natijasi tashqaridan kelganda ham sinxron turadi), forma bilan
 * birga yuborilishi uchun ichida yashirin `<input type="hidden">` bor.
 */
export function RichTextEditor({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
      Image.configure({ inline: false }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    editorProps: {
      attributes: {
        class: "article-body min-h-[320px] px-4 py-3 text-[13px] leading-[1.75] outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Tashqaridan (AI to'ldirish, tarjima) kelgan qiymat muharrirga sinxronlanadi.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            blockquote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
            table: editor.isActive("table"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  });

  if (!editor || !state) {
    return (
      <div className="mt-2 h-[380px] animate-pulse rounded-[12px] border border-[#dce9e8] bg-[#f5fbfa]" />
    );
  }

  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkOpen(true);
  };

  const applyLink = () => {
    const href = linkUrl.trim();
    if (href) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkOpen(false);
  };

  const pickImage = async (file: File | null) => {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const result = await uploadEditorImage(file);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (!result.ok) return setUploadError(result.error);
    editor.chain().focus().setImage({ src: result.url }).run();
  };

  return (
    <div className="mt-2 overflow-hidden rounded-[12px] border border-[#dce9e8] bg-white focus-within:border-accent">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#eaf1f0] bg-[#f9fdfc] p-2">
        <ToolbarButton label="Qalin" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </ToolbarButton>
        <ToolbarButton label="Kursiv" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton label="Tagiga chizilgan" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton label="Chizib o‘tilgan" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#e0eceb]" />

        <ToolbarButton label="Sarlavha 2" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton label="Sarlavha 3" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#e0eceb]" />

        <ToolbarButton label="Nuqtali ro‘yxat" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •≡
        </ToolbarButton>
        <ToolbarButton label="Raqamli ro‘yxat" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.≡
        </ToolbarButton>
        <ToolbarButton label="Iqtibos" active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#e0eceb]" />

        <ToolbarButton label="Havola" active={state.link} onClick={openLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton
          label="Rasm qo‘shish"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "…" : "🖼"}
        </ToolbarButton>
        <ToolbarButton
          label="Jadval qo‘shish"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          ▦
        </ToolbarButton>

        {state.table && (
          <>
            <span className="mx-1 h-5 w-px bg-[#e0eceb]" />
            <ToolbarButton label="Qator qo‘shish" onClick={() => editor.chain().focus().addRowAfter().run()}>
              +Q
            </ToolbarButton>
            <ToolbarButton label="Ustun qo‘shish" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              +U
            </ToolbarButton>
            <ToolbarButton label="Jadvalni o‘chirish" onClick={() => editor.chain().focus().deleteTable().run()}>
              🗑
            </ToolbarButton>
          </>
        )}

        <span className="mx-1 h-5 w-px bg-[#e0eceb]" />

        <ToolbarButton label="Bekor qilish" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()}>
          ↺
        </ToolbarButton>
        <ToolbarButton label="Qaytarish" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()}>
          ↻
        </ToolbarButton>
      </div>

      {linkOpen && (
        <div className="flex items-center gap-2 border-b border-[#eaf1f0] bg-[#f9fdfc] p-2">
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setLinkOpen(false);
            }}
            placeholder="https://..."
            className="h-8 flex-1 rounded-[8px] border border-[#dce9e8] px-2.5 text-[11px] outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={applyLink}
            className="h-8 cursor-pointer rounded-[8px] bg-brand-gradient px-3 text-[10px] font-bold text-white"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="h-8 cursor-pointer rounded-[8px] border border-[#dce9e8] px-3 text-[10px] font-bold"
          >
            Bekor
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={(e) => void pickImage(e.target.files?.[0] ?? null)}
        className="sr-only"
      />

      <EditorContent editor={editor} />

      {uploadError && (
        <p className="border-t border-[#f0dede] bg-[#fdf6f6] px-4 py-2 text-[10px] font-semibold text-[#9d4c4c]">
          {uploadError}
        </p>
      )}

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
