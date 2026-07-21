import Image from "next/image";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

/** Cifrele afișate lângă poveste. Doar informații verificate. */
const FACTS = [
  { value: "4,9", label: "notă medie pe Google" },
  { value: "20–40", label: "lei de persoană" },
  { value: "100%", label: "cafea de specialitate" },
];

export function Story() {
  return (
    <section
      id="povestea-noastra"
      className="scroll-mt-28 border-t border-ivory/5 py-24 md:py-32"
      aria-labelledby="povestea-noastra-titlu"
    >
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal as="p" className="eyebrow mb-5">
              Povestea noastră
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="povestea-noastra-titlu"
                className="text-4xl text-ivory sm:text-5xl"
              >
                Un loc construit în jurul unei ceșcuțe.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted">
                <p>
                  MeetCoffee a pornit dintr-o idee simplă: cafeaua bună nu este
                  un scop în sine, ci un motiv de a te opri și de a sta de vorbă
                  cu cineva. De aceea am pus semnul egal între ce se întâmplă în
                  ceașcă și ce se întâmplă la masă.
                </p>
                <p>
                  Lucrăm exclusiv cu cafea de specialitate prăjită de{" "}
                  <strong className="font-medium text-ivory">
                    {site.supplier.name}
                  </strong>
                  , cu origine cunoscută și prăjire recentă. Fiecare rețetă este
                  măsurată: doza, timpul de extragere și temperatura sunt
                  verificate zilnic, pentru ca ceașca de marți dimineață să fie
                  la fel de bună ca cea de sâmbătă seara.
                </p>
                <p>
                  Restul ține de atmosferă. Un spațiu luminos în centrul
                  Craiovei, mese pregătite dis-de-dimineață și oameni cărora le
                  place ce fac. Atât.
                </p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ivory/10 pt-8">
                {/*
                  `flex-col-reverse` afișează valoarea deasupra etichetei,
                  păstrând în DOM ordinea corectă dt → dd. Eticheta apare o
                  singură dată, deci cititoarele de ecran nu o repetă.
                */}
                {FACTS.map((fact) => (
                  <div key={fact.label} className="flex flex-col-reverse">
                    <dt className="mt-2 text-xs leading-snug text-muted">
                      {fact.label}
                    </dt>
                    <dd className="font-display text-3xl text-crema">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Colaj editorial asimetric — nu o grilă de fotografii identice. */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Reveal className="col-span-2">
                <figure className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src="/images/gallery/interior-01.webp"
                    alt="Interior de cafenea cu mese de marmură, lemn închis la culoare și lumină caldă"
                    fill
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>

              <Reveal delay={120}>
                <figure className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src="/images/gallery/latte-art.webp"
                    alt="Lapte texturat turnat peste espresso, formând un desen în formă de lalea"
                    fill
                    sizes="(min-width: 1024px) 23vw, 50vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>

              <Reveal delay={200}>
                <figure className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src="/images/gallery/beans.webp"
                    alt="Boabe de cafea proaspăt prăjite pe o suprafață închisă de ardezie"
                    fill
                    sizes="(min-width: 1024px) 23vw, 50vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
