-- CureLife — Supabase sxemasi.
-- Bir marta ishga tushiriladi: Supabase dashboard → SQL Editor → New query →
-- shu faylni to'liq joylab → Run.
--
-- Yagona jadval: har bir "fayl" (avval data/*.json bo'lgan) shu yerda bitta
-- qator sifatida saqlanadi (key = fayl nomi, value = butun JSON). Bu admin
-- panel kodini (lib/admin/store.ts) deyarli o'zgartirmasdan fayl tizimidan
-- bazaga o'tkazish imkonini beradi.
--
-- RLS ataylab YOQILMAGAN: bu jadvalga faqat serverdan (Next.js server
-- action'lar), service_role kaliti bilan kiriladi — brauzerdan to'g'ridan-
-- to'g'ri kirish yo'q, shuning uchun qatorlar siyosati kerak emas.

create table if not exists public.app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.app_data_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists app_data_touch on public.app_data;
create trigger app_data_touch
  before update on public.app_data
  for each row execute function public.app_data_set_updated_at();
