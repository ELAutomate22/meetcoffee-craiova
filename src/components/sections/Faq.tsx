import { publishedFaq } from "@/data/faq";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Întrebări frecvente.
 *
 * Folosim `<details>`/`<summary>` nativ: se deschide și fără JavaScript, este
 * accesibil implicit de la tastatură și este anunțat corect de cititoarele de
 * ecran, fără să scriem un singur `aria-`.
 *
 * Sunt afișate DOAR întrebările confirmate — vezi src/data/faq.ts.
 */
export function Faq() {
  if (publishedFaq.length === 0) return null;

  return (
    <section
      id="intrebari-frecvente"
      className="scroll-mt-28 border-t border-ivory/5 py-24 md:py-32"
      aria-labelledby="intrebari-frecvente-titlu"
    >
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <header className="lg:col-span-4">
            <Reveal as="p" className="eyebrow mb-5">
              Întrebări frecvente
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="intrebari-frecvente-titlu"
                className="text-4xl text-ivory sm:text-5xl"
              >
                Ce ne întreabă lumea.
              </h2>
            </Reveal>
          </header>

          <div className="lg:col-span-8">
            <ul>
              {publishedFaq.map((item, index) => (
                <Reveal as="li" key={item.id} delay={index * 60}>
                  <details className="group border-b border-ivory/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg text-ivory transition-colors hover:text-crema [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="relative h-4 w-4 shrink-0 text-crema"
                      >
                        <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                      </span>
                    </summary>
                    <p className="max-w-prose pb-7 text-base leading-relaxed text-muted">
                      {item.answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
