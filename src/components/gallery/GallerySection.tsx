"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gallery, galleryHasGeneratedImages } from "@/data/gallery";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Galerie editorială asimetrică, cu vizualizare mărită.
 *
 * Fereastra de mărire este un dialog real: prinde focalizarea cât este
 * deschisă, se închide cu Escape și readuce focalizarea pe imaginea din care
 * a fost deschisă. Se poate naviga cu săgețile.
 */
export function GallerySection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    const previous = openIndex;
    setOpenIndex(null);
    if (previous !== null) {
      // Focalizarea se întoarce de unde a plecat.
      requestAnimationFrame(() => triggersRef.current[previous]?.focus());
    }
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;

    // Blochează derularea în fundal cât timp fereastra este deschisă.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        setOpenIndex((index) => (index === null ? null : (index + 1) % gallery.length));
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((index) =>
          index === null ? null : (index - 1 + gallery.length) % gallery.length,
        );
      }
      // Menține focalizarea în interiorul ferestrei.
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close]);

  const active = openIndex === null ? null : gallery[openIndex];

  return (
    <section
      id="galerie"
      className="scroll-mt-28 border-t border-ivory/5 py-24 md:py-32"
      aria-labelledby="galerie-titlu"
    >
      <div className="container-page">
        <header className="max-w-2xl">
          <Reveal as="p" className="eyebrow mb-5">
            Galerie
          </Reveal>
          <Reveal delay={80}>
            <h2 id="galerie-titlu" className="text-4xl text-ivory sm:text-5xl lg:text-6xl">
              Atmosfera, pe scurt.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Dimineți liniștite, mese pregătite devreme și ceșcuțe care ajung
              exact așa cum trebuie.
            </p>
          </Reveal>
        </header>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {gallery.map((image, index) => (
            <Reveal
              key={image.src}
              delay={(index % 4) * 80}
              className={image.span === 2 ? "col-span-2" : ""}
            >
              <button
                ref={(node) => {
                  triggersRef.current[index] = node;
                }}
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group relative block w-full overflow-hidden rounded-[var(--radius-card)]"
              >
                <span
                  className={`relative block ${
                    image.span === 2 ? "aspect-[16/10]" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    sizes={
                      image.span === 2
                        ? "(min-width: 1024px) 50vw, 100vw"
                        : "(min-width: 1024px) 25vw, 50vw"
                    }
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                  />
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-left text-sm text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {image.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {galleryHasGeneratedImages ? (
          <p className="mt-8 text-xs leading-relaxed text-taupe">
            Imaginile de mai sus sunt fotografii de prezentare, folosite până la
            publicarea fotografiilor realizate în cafenea.
          </p>
        ) : null}
      </div>

      {/* Vizualizare mărită */}
      {active ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/95 p-4 backdrop-blur-sm sm:p-8"
        >
          {/* Fundalul închide fereastra la clic. */}
          <button
            type="button"
            onClick={close}
            aria-label="Închide imaginea"
            className="absolute inset-0 cursor-default"
            tabIndex={-1}
          />

          <figure className="relative z-10 max-h-full w-full max-w-5xl">
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="mx-auto max-h-[75vh] w-auto rounded-[var(--radius-card)] object-contain"
            />
            <figcaption className="mt-5 text-center text-sm text-muted">
              {active.caption}
              <span className="mt-1 block text-xs text-taupe">
                Imaginea {openIndex! + 1} din {gallery.length} · folosește
                săgețile pentru a naviga
              </span>
            </figcaption>
          </figure>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-crema hover:text-crema sm:right-8 sm:top-8"
          >
            <span className="sr-only">Închide imaginea</span>
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setOpenIndex((index) =>
                index === null ? null : (index - 1 + gallery.length) % gallery.length,
              )
            }
            className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-colors hover:border-crema sm:left-6"
          >
            <span className="sr-only">Imaginea anterioară</span>
            <span aria-hidden="true">‹</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setOpenIndex((index) => (index === null ? null : (index + 1) % gallery.length))
            }
            className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-colors hover:border-crema sm:right-6"
          >
            <span className="sr-only">Imaginea următoare</span>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
