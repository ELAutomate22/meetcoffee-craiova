import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Învelișul standard al unei secțiuni: ancoră pentru navigație, titlu
 * editorial și ritm vertical constant pe tot site-ul.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  headingLevel = 2,
}: {
  id: string;
  /** Eticheta mică de deasupra titlului. */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <section
      id={id}
      // `scroll-mt` compensează bara fixă, ca titlul să nu ajungă sub ea.
      className={`scroll-mt-28 py-24 md:py-32 ${className}`}
      aria-labelledby={`${id}-titlu`}
    >
      <div className="container-page">
        <header className="max-w-2xl">
          {eyebrow ? (
            <Reveal as="p" className="eyebrow mb-5">
              {eyebrow}
            </Reveal>
          ) : null}
          <Reveal delay={80}>
            <Heading
              id={`${id}-titlu`}
              className="text-4xl text-ivory sm:text-5xl lg:text-6xl"
            >
              {title}
            </Heading>
          </Reveal>
          {intro ? (
            <Reveal delay={160}>
              <div className="mt-6 text-lg leading-relaxed text-muted">{intro}</div>
            </Reveal>
          ) : null}
        </header>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
