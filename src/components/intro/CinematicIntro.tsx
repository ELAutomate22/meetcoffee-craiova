"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CoffeeSurface } from "./coffeeSurface";
import {
  FULL_TIMELINE,
  SHORT_TIMELINE,
  easeInQuad,
  easeOutExpo,
  hasSeenIntro,
  progress,
  rememberIntro,
  type IntroTimeline,
} from "./introTimeline";
import { isLowPowerDevice, useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * ============================================================================
 *  Introducerea cinematografică
 * ============================================================================
 *
 *  Stări:  loading → ready → playing → impact → curtainOpening → siteVisible
 *          plus  skipped  și  reducedMotion  ca ieșiri directe.
 *
 *  Reguli respectate:
 *   · derularea paginii este blocată doar cât ține introducerea;
 *   · există întotdeauna o ieșire — buton, tasta Escape, tasta Tab;
 *   · dacă imaginea nu se încarcă în 2,5 secunde, site-ul apare oricum;
 *   · fără WebGL sau cu „mișcare redusă”, site-ul apare imediat;
 *   · toate ceasurile și ascultătorii sunt eliberați la ieșire.
 * ============================================================================
 */

type IntroState =
  | "loading"
  | "ready"
  | "playing"
  | "impact"
  | "curtainOpening"
  | "siteVisible"
  | "skipped"
  | "reducedMotion";

const DROPLET_COUNT = 12;

/** Un strop de cafea aruncat de impact. */
type Droplet = {
  angle: number;
  speed: number;
  size: number;
  spin: number;
};

const DROPLETS: Droplet[] = Array.from({ length: DROPLET_COUNT }, (_, i) => {
  // Distribuție ușor neregulată — stropii perfect simetrici arată sintetic.
  const jitter = Math.sin(i * 12.9898) * 0.5;
  return {
    angle: (i / DROPLET_COUNT) * Math.PI * 2 + jitter * 0.5,
    speed: 0.55 + Math.abs(jitter) * 0.8,
    size: 3 + Math.abs(jitter) * 5,
    spin: jitter,
  };
});

export function CinematicIntro() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)") ?? false;
  const [state, setState] = useState<IntroState>("loading");

  /**
   * Sărim complet peste animație pentru vizitatorii care au cerut mișcare
   * redusă. Este o valoare DERIVATĂ, nu una ținută în stare: altfel ar trebui
   * calculată într-un efect, iar site-ul ar apărea cu o randare întârziere.
   */
  const skipAnimation = reducedMotion === true;

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const beanRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dropletsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const skipRef = useRef<HTMLButtonElement>(null);

  const surfaceRef = useRef<CoffeeSurface | null>(null);
  const frameRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const timelineRef = useRef<IntroTimeline>(FULL_TIMELINE);
  /** Ne asigurăm că finalizarea rulează o singură dată (fără dublă tranziție). */
  const finishedRef = useRef(false);
  /** Bucla de animație pornește o singură dată, oricâte re-randări ar urma. */
  const startedRef = useRef(false);

  /** Încheie introducerea și redă pagina utilizatorului. */
  const finish = useCallback((next: IntroState) => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    surfaceRef.current?.dispose();
    surfaceRef.current = null;

    document.body.removeAttribute("data-intro-locked");
    rememberIntro();

    // Dacă focalizarea era pe butonul de omitere, care tocmai dispare, o mutăm
    // pe conținutul principal ca utilizatorii de tastatură să nu o piardă.
    const skipHadFocus = document.activeElement === skipRef.current;
    setState(next);

    if (skipHadFocus) {
      requestAnimationFrame(() => {
        document.getElementById("continut-principal")?.focus();
      });
    }
  }, []);

  // --- Blochează derularea cât timp introducerea este pe ecran. --------------
  useEffect(() => {
    const running =
      !skipAnimation &&
      (state === "loading" ||
        state === "ready" ||
        state === "playing" ||
        state === "impact" ||
        state === "curtainOpening");

    if (running) {
      document.body.setAttribute("data-intro-locked", "true");
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.removeAttribute("data-intro-locked");
    };
  }, [state, skipAnimation]);

  // --- Ieșiri de urgență: Escape și Tab. ------------------------------------
  useEffect(() => {
    if (state === "siteVisible" || state === "skipped" || state === "reducedMotion") return;

    const onKeyDown = (event: KeyboardEvent) => {
      // Tab înseamnă că cineva navighează cu tastatura: nu îi ținem calea.
      if (event.key === "Escape" || event.key === "Tab") {
        finish("skipped");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state, finish]);

  // --- Bucla principală ------------------------------------------------------
  //
  // Acest efect NU depinde de `state`, deși îl modifică. Dacă ar depinde,
  // primul `setState("playing")` i-ar declanșa curățarea și ar opri bucla
  // imediat după pornire. Pornirea unică este garantată de `startedRef`.
  useEffect(() => {
    if (reducedMotion === null || skipAnimation) return;
    if (startedRef.current || finishedRef.current) return;
    // Dispozitivele slabe sau conexiunile cu economie de date primesc direct
    // site-ul, fără simulare WebGL.
    if (isLowPowerDevice()) {
      finish("reducedMotion");
      return;
    }
    startedRef.current = true;

    const canvas = canvasRef.current;
    const poster = posterRef.current;
    if (!canvas || !poster) return;

    let cancelled = false;

    /** Dacă imaginea nu ajunge la timp, nu ținem vizitatorul blocat. */
    const failSafe = window.setTimeout(() => {
      if (!cancelled && !finishedRef.current) finish("skipped");
    }, 2500);

    /** Ceasurile care trebuie oprite la demontare, oricare ar fi calea de ieșire. */
    const timers: number[] = [];

    const begin = () => {
      if (cancelled || finishedRef.current) return;

      const surface = CoffeeSurface.create(canvas, poster);
      if (!surface) {
        // Fără WebGL: rămâne imaginea statică, apoi trecem la site.
        timers.push(window.setTimeout(() => finish("skipped"), 900));
        return;
      }

      surfaceRef.current = surface;
      surface.resize();
      // Pictăm imediat cadrul de repaus. Fără el, canvasul ar fi transparent
      // până la primul `requestAnimationFrame`, iar la schimbul cu imaginea
      // s-ar vedea o clipire.
      surface.render({ ripple: -1, split: 0, fade: 1 });

      const timeline = hasSeenIntro() ? SHORT_TIMELINE : FULL_TIMELINE;
      timelineRef.current = timeline;
      startedAtRef.current = performance.now();
      setState("playing");

      // `requestAnimationFrame` nu rulează în filele ascunse sau acoperite de
      // alte ferestre. Fără plasa asta de siguranță, cineva care deschide
      // site-ul într-o filă de fundal s-ar întoarce la o pagină blocată, cu
      // derularea oprită. Ceasul de perete încheie introducerea oricum.
      timers.push(
        window.setTimeout(() => finish("siteVisible"), (timeline.total + 1.5) * 1000),
      );

      const onResize = () => surface.resize();
      window.addEventListener("resize", onResize);

      const tick = (now: number) => {
        if (cancelled || finishedRef.current) return;

        const time = (now - startedAtRef.current) / 1000;
        const { fallStart, impact, curtainStart, curtainEnd, total, fallHeight } = timeline;

        const center = surface.projectCenter();
        const rippleTime = time - impact;

        // --- cortina ---------------------------------------------------------
        const splitProgress = easeOutExpo(progress(time, curtainStart, curtainEnd));
        const split = splitProgress * 0.52;

        // Stingem doar pe ultima porțiune, ca panourile să nu dispară brusc.
        const fade = 1 - progress(time, curtainEnd - 0.35, total);

        surface.render({ ripple: rippleTime, split, fade });

        // --- bobul de cafea --------------------------------------------------
        const bean = beanRef.current;
        if (bean) {
          if (time < impact) {
            const fall = easeInQuad(progress(time, fallStart, impact));
            const from = -fallHeight * window.innerHeight;
            const y = center.y + from * (1 - fall);
            // Bobul se apropie de cameră, deci pare puțin mai mare la început.
            const scale = 1.45 - 0.45 * fall;
            const beanWidth = center.textureWidth * 0.078;

            bean.style.width = `${beanWidth}px`;
            bean.style.opacity = time < fallStart ? "0" : "1";
            bean.style.transform =
              `translate3d(${center.x}px, ${y}px, 0) ` +
              `translate(-50%, -50%) scale(${scale}) rotate(${fall * 22 - 8}deg)`;
          } else {
            // A intrat în lichid.
            bean.style.opacity = "0";
          }
        }

        // --- stropii ---------------------------------------------------------
        if (rippleTime >= 0 && rippleTime < 0.9) {
          const scale = center.textureWidth * 0.16;
          DROPLETS.forEach((droplet, index) => {
            const node = dropletsRef.current[index];
            if (!node) return;
            const t = rippleTime;
            const x = center.x + Math.cos(droplet.angle) * droplet.speed * t * scale;
            // Aruncare în sus, apoi cădere — parabolă simplă, dar corectă.
            const lift = Math.sin(droplet.angle) * 0.35 + 0.75;
            const y =
              center.y -
              lift * droplet.speed * t * scale * 1.6 +
              0.5 * 9.6 * t * t * scale;

            node.style.opacity = String(Math.max(0, 1 - t / 0.75));
            node.style.width = `${droplet.size}px`;
            node.style.height = `${droplet.size * (1 + droplet.spin * 0.3)}px`;
            node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
          });
        } else if (rippleTime >= 0.9) {
          dropletsRef.current.forEach((node) => {
            if (node) node.style.opacity = "0";
          });
        }

        // --- textul de brand -------------------------------------------------
        const content = contentRef.current;
        if (content) {
          const appear = progress(time, fallStart + 0.1, impact);
          const leave = progress(time, curtainStart - 0.25, curtainStart + 0.5);
          // Un tresărit fin exact la impact: textul simte lovitura.
          const jolt = rippleTime > 0 && rippleTime < 0.4 ? Math.exp(-rippleTime * 12) * 5 : 0;
          content.style.opacity = String(appear * (1 - leave));
          content.style.transform = `translate3d(0, ${(1 - appear) * 18 + jolt}px, 0)`;
        }

        // --- avansarea stărilor ---------------------------------------------
        if (time >= curtainStart) setState("curtainOpening");
        else if (time >= impact) setState("impact");

        if (time >= total) {
          window.removeEventListener("resize", onResize);
          finish("siteVisible");
          return;
        }

        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    let cleanupVisibility: (() => void) | null = null;

    /**
     * Dacă fila este ascunsă chiar la deschidere (link deschis într-o filă de
     * fundal), nu pornim cronometrul: altfel vizitatorul s-ar întoarce la o
     * introducere deja consumată. Așteptăm să se uite la pagină.
     */
    const start = () => {
      // Imaginea a ajuns, deci plasa pentru „nu s-a încărcat” nu mai e nevoie.
      window.clearTimeout(failSafe);

      if (!document.hidden) {
        begin();
        return;
      }
      const onVisible = () => {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onVisible);
        begin();
      };
      document.addEventListener("visibilitychange", onVisible);
      cleanupVisibility = () =>
        document.removeEventListener("visibilitychange", onVisible);
    };

    if (poster.complete && poster.naturalWidth > 0) {
      start();
    } else {
      poster.addEventListener("load", start, { once: true });
      poster.addEventListener(
        "error",
        () => {
          window.clearTimeout(failSafe);
          finish("skipped");
        },
        { once: true },
      );
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      timers.forEach((timer) => window.clearTimeout(timer));
      cleanupVisibility?.();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      surfaceRef.current?.dispose();
      surfaceRef.current = null;
    };
  }, [reducedMotion, skipAnimation, finish]);

  const done =
    skipAnimation ||
    state === "siteVisible" ||
    state === "skipped" ||
    state === "reducedMotion";
  if (done) return null;

  const plate = isMobile
    ? "/images/intro/intro-plate-mobile.webp"
    : "/images/intro/intro-plate-desktop.webp";

  const closing = state === "curtainOpening";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[70] overflow-hidden bg-espresso"
      role="dialog"
      aria-label="Introducere animată MeetCoffee"
      aria-modal="false"
      data-state={state}
    >
      {/*
        Imaginea este și cadrul de start, și textura pentru shader. Fiind
        exact aceeași sursă, trecerea de la imagine la canvas nu se vede:
        nu există cadru negru și nici salt de încadrare.
      */}
      {/*
        Element `<img>` nativ, intenționat, nu `next/image`: exact acest nod
        este încărcat ca textură WebGL (`texImage2D`). `next/image` inserează
        un wrapper și schimbă sursa în timp, deci nu oferă o referință stabilă
        către imaginea decodată. Fișierul este deja WebP optimizat și
        preîncărcat din `layout.tsx`, deci nu pierdem nimic la performanță.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
        src={plate}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        crossOrigin="anonymous"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: state === "loading" ? 1 : 0 }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: state === "loading" ? 0 : 1 }}
      />

      {/* Vignetă caldă — adâncește cadrul fără să acopere ceașca. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 47%, transparent 30%, rgba(11,6,5,0.55) 72%, rgba(11,6,5,0.9) 100%)",
          opacity: closing ? 0 : 1,
        }}
      />

      {/* Bobul este poziționat pe fiecare cadru din bucla de animație, deci
          are nevoie de un nod DOM stabil, cu transformare proprie. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={beanRef}
        src="/images/intro/intro-bean.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pointer-events-none absolute left-0 top-0 origin-center will-change-transform"
        style={{ opacity: 0 }}
      />

      {DROPLETS.map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            dropletsRef.current[index] = node;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 rounded-full will-change-transform"
          style={{
            opacity: 0,
            background:
              "radial-gradient(circle at 34% 30%, #a9713c 0%, #56290f 55%, #22100a 100%)",
            boxShadow: "0 0 6px rgba(185,109,58,0.5)",
          }}
        />
      ))}

      {/* Numele de brand, peste imagine. */}
      <div
        ref={contentRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[12vh] px-6 text-center will-change-transform"
        style={{ opacity: 0 }}
      >
        <p className="font-display text-4xl tracking-tight text-ivory sm:text-6xl">
          Meet<span className="text-crema">Coffee</span>
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.32em] text-muted sm:text-sm">
          Cafea de specialitate · Craiova
        </p>
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={() => finish("skipped")}
        className="absolute bottom-6 right-6 rounded-[999px] border border-ivory/20 bg-espresso/50 px-5 py-2.5 text-sm text-ivory/90 backdrop-blur-sm transition hover:border-crema/60 hover:text-ivory focus-visible:border-crema"
      >
        Sari peste introducere
      </button>
    </div>
  );
}
