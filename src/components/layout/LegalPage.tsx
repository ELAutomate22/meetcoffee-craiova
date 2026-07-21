import Link from "next/link";
import type { ReactNode } from "react";

/** Șablon comun pentru paginile de informare (confidențialitate, cookie-uri, accesibilitate). */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main id="continut-principal" tabIndex={-1} className="focus-visible:outline-none">
      <div className="container-page py-24 md:py-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-crema transition-colors hover:text-ivory"
        >
          <span aria-hidden="true">←</span> Înapoi la pagina principală
        </Link>

        <h1 className="mt-10 max-w-3xl text-4xl text-ivory sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>

        <div className="mt-16 max-w-2xl space-y-12">{children}</div>
      </div>
    </main>
  );
}

/** O secțiune dintr-o pagină de informare. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ivory">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}
