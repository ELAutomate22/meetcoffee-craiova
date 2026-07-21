"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Face conținutul să apară lin când intră în ecran.
 *
 * Fără JavaScript sau cu „mișcare redusă” activată, conținutul este pur și
 * simplu vizibil — efectul este un adaos, nu o condiție de lizibilitate.
 * Observatorul se deconectează după prima apariție, ca să nu rămână activ
 * pentru zeci de elemente pe toată durata vizitei.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Întârziere în milisecunde, pentru apariții în cascadă. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.setAttribute("data-revealed", "true");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
