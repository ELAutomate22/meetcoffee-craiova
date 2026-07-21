import { rating, reviews } from "@/data/reviews";
import { formatRating } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

/** Cinci stele, umplute proporțional cu nota. Pur decorativ. */
function Stars({ value }: { value: number }) {
  return (
    <span aria-hidden="true" className="inline-flex gap-1 text-crema">
      {[0, 1, 2, 3, 4].map((index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path
            d="M10 1.5l2.47 5.35 5.78.66-4.3 3.95 1.16 5.74L10 14.3l-5.11 2.9 1.16-5.74-4.3-3.95 5.78-.66L10 1.5z"
            opacity={index < Math.round(value) ? 1 : 0.22}
          />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section
      id="recenzii"
      className="scroll-mt-28 border-t border-ivory/5 bg-void/40 py-24 md:py-32"
      aria-labelledby="recenzii-titlu"
    >
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <header className="lg:col-span-4">
            <Reveal as="p" className="eyebrow mb-5">
              Recenzii
            </Reveal>
            <Reveal delay={80}>
              <h2 id="recenzii-titlu" className="text-4xl text-ivory sm:text-5xl">
                Ce spun oamenii care trec pe la noi.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-10 rounded-[var(--radius-card)] border border-ivory/10 surface p-8">
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-6xl text-crema">
                    {formatRating(rating.value)}
                  </span>
                  <span className="text-lg text-muted">/ {rating.best}</span>
                </p>
                <div className="mt-4">
                  <Stars value={rating.value} />
                  <span className="sr-only">
                    Notă medie {formatRating(rating.value)} din {rating.best}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  Notă medie pe {rating.source}
                  {/*
                    Numărul de recenzii se afișează doar dacă a fost confirmat.
                    Sursele disponibile indicau valori diferite, deci nu
                    afirmăm un total. Vezi src/data/reviews.ts.
                  */}
                  {rating.count !== null ? `, din ${rating.count} recenzii` : ""}.
                </p>
              </div>
            </Reveal>
          </header>

          <div className="lg:col-span-8">
            <ul className="grid gap-5 sm:grid-cols-2">
              {reviews.map((review, index) => (
                <Reveal
                  key={review.id}
                  as="li"
                  delay={index * 100}
                  className={index === 0 ? "sm:col-span-2" : ""}
                >
                  <figure className="h-full rounded-[var(--radius-card)] border border-ivory/10 surface p-8 transition-colors duration-500 hover:border-crema/25">
                    <Stars value={review.stars} />
                    <span className="sr-only">{review.stars} din 5 stele</span>
                    <blockquote className="mt-5">
                      <p className="font-display text-xl leading-snug text-ivory sm:text-2xl">
                        „{review.quote}”
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-muted">
                      {review.author ?? "Recenzie Google"}
                      <span className="mt-1 block text-xs text-taupe">
                        Sursă: {review.source}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>

            <p className="mt-8 text-xs leading-relaxed text-taupe">
              Textele de mai sus sunt fragmente din recenzii publice, redate în
              limba română. Recenziile complete pot fi consultate pe {rating.source}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
