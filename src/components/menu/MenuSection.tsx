"use client";

import { useId, useRef, useState } from "react";
import { menu, menuMeta, type MenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Meniul interactiv.
 *
 * Filtrele sunt implementate ca un set de taburi accesibile (rol `tablist`),
 * cu navigare cu săgeți, exact cum se așteaptă un utilizator de tastatură.
 * Nu există butoane de comandă — site-ul este doar de prezentare.
 */
export function MenuSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const activeCategory = menu[activeIndex];

  /** Săgeți stânga/dreapta, Home și End — comportament standard de taburi. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const lastIndex = menu.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = activeIndex === lastIndex ? 0 : activeIndex + 1;
    if (event.key === "ArrowLeft") next = activeIndex === 0 ? lastIndex : activeIndex - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = lastIndex;

    if (next !== null) {
      event.preventDefault();
      setActiveIndex(next);
      tabsRef.current[next]?.focus();
    }
  };

  return (
    <section
      id="meniu"
      className="scroll-mt-28 border-t border-ivory/5 py-24 md:py-32"
      aria-labelledby="meniu-titlu"
    >
      <div className="container-page">
        <header className="max-w-2xl">
          <Reveal as="p" className="eyebrow mb-5">
            Meniu
          </Reveal>
          <Reveal delay={80}>
            <h2 id="meniu-titlu" className="text-4xl text-ivory sm:text-5xl lg:text-6xl">
              Ce se prepară la bar.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Aceeași cafea, extrasă în mai multe feluri. Alege metoda care ți se
              potrivește — sau întreabă baristul ce merge cel mai bine astăzi.
            </p>
          </Reveal>
        </header>

        {/*
          Notă de transparență: cât timp meniul nu este confirmat de proprietar,
          spunem clar vizitatorului că este orientativ. Vezi src/data/menu.ts.
        */}
        {!menuMeta.confirmed ? (
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-crema/20 bg-crema/5 px-5 py-4 text-sm leading-relaxed text-muted">
              <span className="font-medium text-crema">Meniu orientativ.</span>{" "}
              Sortimentele și prețurile de mai jos sunt afișate ca exemplu și pot
              diferi de oferta din cafenea. Meniul complet și actualizat îl
              găsești la fața locului.
            </p>
          </Reveal>
        ) : null}

        {/* Filtre de categorie */}
        <Reveal delay={240}>
          <div
            role="tablist"
            aria-label="Categorii din meniu"
            onKeyDown={onKeyDown}
            className="mt-12 flex flex-wrap gap-2"
          >
            {menu.map((category, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={category.id}
                  ref={(node) => {
                    tabsRef.current[index] = node;
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${category.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${category.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-[999px] border px-5 py-2.5 text-sm transition-all duration-300 ${
                    selected
                      ? "border-crema bg-crema text-espresso"
                      : "border-ivory/15 text-muted hover:border-ivory/35 hover:text-ivory"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Panoul categoriei active */}
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeCategory.id}`}
          aria-labelledby={`${baseId}-tab-${activeCategory.id}`}
          tabIndex={0}
          className="mt-12 focus-visible:outline-none"
        >
          <p className="max-w-2xl text-base leading-relaxed text-taupe">
            {activeCategory.blurb}
          </p>

          <ul
            // `key` forțează reconstruirea listei la schimbarea categoriei,
            // ca animația de apariție să pornească din nou.
            key={activeCategory.id}
            className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2"
          >
            {activeCategory.items.map((item, index) => (
              <MenuRow key={item.id} item={item} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MenuRow({ item, index }: { item: MenuItem; index: number }) {
  const price = formatPrice(item.price);

  return (
    <li
      className="group border-b border-ivory/8 py-6 transition-colors duration-300 hover:border-crema/30"
      style={{
        animation: "menuFadeIn 0.5s var(--ease-out-soft) both",
        animationDelay: `${index * 45}ms`,
      }}
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="font-display text-2xl text-ivory transition-colors duration-300 group-hover:text-crema">
          {item.name}
          {item.badge ? (
            <span className="ml-3 align-middle rounded-[999px] border border-crema/35 px-2.5 py-1 font-sans text-[0.625rem] uppercase tracking-[0.14em] text-crema">
              {item.badge}
            </span>
          ) : null}
        </h3>

        {/* Linie punctată care leagă numele de preț, ca într-un meniu tipărit. */}
        <span
          aria-hidden="true"
          className="mb-1 hidden min-w-8 flex-1 border-b border-dotted border-ivory/15 sm:block"
        />

        <span className="shrink-0 font-display text-xl text-crema">
          {price ?? <span className="text-base text-muted">preț la bar</span>}
        </span>
      </div>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
        {item.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-taupe">
        {item.size ? <span>{item.size}</span> : null}
        {item.detail ? <span>{item.detail}</span> : null}
        {item.dietary?.map((tag) => (
          <span key={tag} className="text-copper">
            {tag}
          </span>
        ))}
      </div>
    </li>
  );
}
