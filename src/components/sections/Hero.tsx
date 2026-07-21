import Image from "next/image";
import { site } from "@/data/site";
import { OpenStatus } from "@/components/location/OpenStatus";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Hero — primul lucru care apare din spatele cortinei.
 *
 * Fundalul este ACELAȘI cadru folosit în introducere, ușor mărit și
 * întunecat. Așa, momentul în care cortina se deschide pare o continuare a
 * scenei, nu trecerea la altă fotografie.
 */
export function Hero() {
  return (
    <section
      id="acasa"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
      aria-labelledby="titlu-principal"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/intro/intro-fallback.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-center opacity-45"
        />
        {/* Gradient dublu: adâncime jos, lizibilitate garantată pentru text. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,transparent_0%,rgba(11,6,5,0.75)_65%,var(--color-espresso)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-espresso to-transparent" />
      </div>

      <div className="container-page relative">
        <div className="max-w-3xl">
          <Reveal as="p" className="eyebrow mb-6">
            {site.supplier.label}
          </Reveal>

          <Reveal delay={100}>
            <h1
              id="titlu-principal"
              className="text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] text-ivory"
            >
              Cafeaua care ne
              <br />
              aduce <span className="text-crema">împreună</span>.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Cafea de specialitate, preparată cu atenție, într-un loc gândit
              pentru conversații bune, dimineți liniștite și întâlniri care
              contează.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#meniu"
                className="rounded-[999px] bg-crema px-8 py-4 font-medium text-espresso transition-transform duration-300 hover:scale-[1.03] hover:bg-ivory"
              >
                Descoperă meniul
              </a>
              <a
                href="#locatie"
                className="rounded-[999px] border border-ivory/25 px-8 py-4 text-ivory transition-colors hover:border-crema hover:text-crema"
              >
                Găsește-ne
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
              <OpenStatus />
              <span aria-hidden="true" className="hidden h-4 w-px bg-ivory/15 sm:block" />
              <span>{site.address.areaNote}</span>
              <span aria-hidden="true" className="hidden h-4 w-px bg-ivory/15 sm:block" />
              <span>{site.priceRange.label}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
