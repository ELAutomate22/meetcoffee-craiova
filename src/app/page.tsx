import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { MenuSection } from "@/components/menu/MenuSection";
import { Process } from "@/components/sections/Process";
import { GallerySection } from "@/components/gallery/GallerySection";
import { Reviews } from "@/components/sections/Reviews";
import { LocationSection } from "@/components/location/LocationSection";
import { Faq } from "@/components/sections/Faq";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />

      {/*
        Introducerea este un strat suprapus. Site-ul de dedesubt este randat
        pe server și complet prezent în HTML de la început — deci este indexat
        de motoarele de căutare și citit de cititoarele de ecran chiar dacă
        animația nu rulează niciodată.
      */}
      <CinematicIntro />

      <SiteHeader />

      <main id="continut-principal" tabIndex={-1} className="focus-visible:outline-none">
        <Hero />
        <Story />
        <MenuSection />
        <Process />
        <GallerySection />
        <Reviews />
        <LocationSection />
        <Faq />
      </main>

      <SiteFooter />
    </>
  );
}
