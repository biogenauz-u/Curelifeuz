import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { Articles } from "@/components/sections/Articles";
import { Concerns } from "@/components/sections/Concerns";
import { Directions } from "@/components/sections/Directions";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { ProductPassport } from "@/components/sections/ProductPassport";
import { Stats } from "@/components/sections/Stats";
import { Trust } from "@/components/sections/Trust";
import { VideoBlock } from "@/components/sections/VideoBlock";
import { getProducts } from "@/lib/admin/store";

export default async function Home() {
  // Mahsulotlar bo'yicha yagona manba: statistika, "CureLife haqida"
  // matnidagi son va pasport bo'limi shu ro'yxatdan hisoblanadi.
  const products = (await getProducts()).filter((p) => p.visible);

  return (
    <>
      <main className="flex-1">
        <Hero />
        <Stats productCount={products.length} />
        <Concerns />
        <Directions />
        <ProductPassport products={products} />
        <Trust />
        <About productCount={products.length} />
        <Journey />
        <VideoBlock />
        <Articles />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
