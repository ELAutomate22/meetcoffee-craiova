"use client";

import { useEffect, useRef, useState } from "react";

/** Elementele din bara de navigație. Ordinea de aici este ordinea afișată. */
const NAV_ITEMS = [
  { id: "acasa", label: "Acasă" },
  { id: "povestea-noastra", label: "Povestea noastră" },
  { id: "meniu", label: "Meniu" },
  { id: "galerie", label: "Galerie" },
  { id: "recenzii", label: "Recenzii" },
  { id: "locatie", label: "Locație" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const [active, setActive] = useState("acasa");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /** Secțiunea curentă, urmărită cu IntersectionObserver (fără ascultător de scroll). */
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => node !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // Alegem secțiunea cea mai vizibilă, nu prima care intersectează —
        // altfel indicatorul sare înainte și înapoi între două secțiuni.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Escape închide meniul mobil și readuce focalizarea pe buton. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      {/* Prima oprire pentru navigarea cu tastatura. */}
      <a
        href="#continut-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-[999px] focus:bg-crema focus:px-5 focus:py-2.5 focus:font-medium focus:text-espresso"
      >
        Sari la conținutul principal
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ivory/10 bg-espresso/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <a
            href="#acasa"
            className="font-display text-xl tracking-tight text-ivory transition-colors hover:text-crema"
          >
            Meet<span className="text-crema">Coffee</span>
          </a>

          {/* Navigație desktop */}
          <nav aria-label="Navigație principală" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block px-4 py-2 text-sm transition-colors ${
                        isActive ? "text-ivory" : "text-muted hover:text-ivory"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-crema transition-transform duration-500 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href="#locatie"
            className="hidden rounded-[999px] border border-crema/40 px-5 py-2.5 text-sm text-crema transition-colors hover:bg-crema hover:text-espresso lg:inline-block"
          >
            Găsește-ne
          </a>

          {/* Buton meniu mobil */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="meniu-mobil"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Închide meniul" : "Deschide meniul"}
            </span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {/* Panou de navigație mobil */}
        <nav
          id="meniu-mobil"
          aria-label="Navigație principală"
          hidden={!menuOpen}
          className="border-t border-ivory/10 bg-espresso/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="container-page py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`block border-b border-ivory/5 py-4 text-lg transition-colors ${
                    active === item.id ? "text-crema" : "text-ivory"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
