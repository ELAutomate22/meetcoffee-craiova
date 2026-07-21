import { Reveal } from "@/components/ui/Reveal";

/** Drumul de la bob la ceașcă. Text redactat, nu marketing generic. */
const STEPS = [
  {
    number: "01",
    title: "Bobul",
    text: "Cafea de specialitate cu origine cunoscută, aleasă pentru profilul ei de aromă, nu doar pentru intensitate.",
  },
  {
    number: "02",
    title: "Prăjirea",
    text: "Prăjită recent de MABO Coffee, într-un profil care scoate în față dulceața naturală și aciditatea echilibrată.",
  },
  {
    number: "03",
    title: "Măcinarea",
    text: "Măcinăm la comandă, pentru fiecare ceașcă. Granulația se reglează în timpul zilei, în funcție de cum se comportă cafeaua.",
  },
  {
    number: "04",
    title: "Extragerea",
    text: "Doză cântărită, timp cronometrat, apă la temperatura potrivită. Ce iese din espressor se gustă înainte să ajungă la tine.",
  },
  {
    number: "05",
    title: "Laptele",
    text: "Texturat până devine mătăsos și lucios, fără spumă uscată. Turnat manual, ceașcă cu ceașcă.",
  },
  {
    number: "06",
    title: "Ceașca",
    text: "Servită la temperatura la care se bea, nu la care arde. Restul depinde de conversație.",
  },
];

export function Process() {
  return (
    <section
      id="proces"
      className="scroll-mt-28 border-t border-ivory/5 bg-void/40 py-24 md:py-32"
      aria-labelledby="proces-titlu"
    >
      <div className="container-page">
        <header className="max-w-2xl">
          <Reveal as="p" className="eyebrow mb-5">
            De la bob la ceașcă
          </Reveal>
          <Reveal delay={80}>
            <h2 id="proces-titlu" className="text-4xl text-ivory sm:text-5xl lg:text-6xl">
              Șase pași care se simt în ceașcă.
            </h2>
          </Reveal>
        </header>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              as="li"
              delay={index * 70}
              className="group relative bg-espresso p-8 transition-colors duration-500 hover:bg-roast lg:p-10"
            >
              <span
                aria-hidden="true"
                className="font-display text-5xl text-crema/25 transition-colors duration-500 group-hover:text-crema/50"
              >
                {step.number}
              </span>
              <h3 className="mt-5 text-2xl text-ivory">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
