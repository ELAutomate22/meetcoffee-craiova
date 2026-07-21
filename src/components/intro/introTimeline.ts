/**
 * ============================================================================
 *  Cronologia introducerii
 * ============================================================================
 *
 *  Toate momentele sunt în secunde de la pornirea animației. Un singur ceas
 *  (un singur `requestAnimationFrame`) citește valorile de aici și mută
 *  simultan bobul, stropii și shaderul — de asta impactul și deschiderea
 *  cortinei rămân sincronizate exact, pe orice dispozitiv.
 *
 *  Modifică duratele aici, nu în componentă.
 * ============================================================================
 */

export type IntroTimeline = {
  /** Momentul în care bobul începe să cadă. */
  fallStart: number;
  /** Momentul impactului cu lichidul. */
  impact: number;
  /** Momentul în care panourile încep să se desfacă. */
  curtainStart: number;
  /** Momentul în care cortina este complet deschisă. */
  curtainEnd: number;
  /** Durata totală. */
  total: number;
  /** Înălțimea de la care pornește bobul, ca fracțiune din înălțimea ferestrei. */
  fallHeight: number;
};

/** Prima vizită — introducerea completă, aproximativ 4,3 secunde. */
export const FULL_TIMELINE: IntroTimeline = {
  fallStart: 0.45,
  impact: 1.35,
  curtainStart: 2.55,
  curtainEnd: 4.15,
  total: 4.35,
  fallHeight: 0.62,
};

/**
 * Vizită repetată — păstrăm impactul și cortina, dar tăiem așteptarea.
 * Aproximativ 2,1 secunde: destul cât tranziția să rămână de brand,
 * prea puțin cât să enerveze pe cineva care revine des.
 */
export const SHORT_TIMELINE: IntroTimeline = {
  fallStart: 0,
  impact: 0.42,
  curtainStart: 0.95,
  curtainEnd: 2.05,
  total: 2.15,
  fallHeight: 0.3,
};

/** Cheia din localStorage care reține că introducerea a fost deja văzută. */
export const INTRO_SEEN_KEY = "meetcoffee:intro-seen";

/** După atâtea zile, vizitatorul revede introducerea completă. */
const REMEMBER_DAYS = 30;

export function hasSeenIntro(): boolean {
  try {
    const raw = window.localStorage.getItem(INTRO_SEEN_KEY);
    if (!raw) return false;
    const seenAt = Number(raw);
    if (!Number.isFinite(seenAt)) return false;
    return Date.now() - seenAt < REMEMBER_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    // Modul privat sau cookie-uri blocate: tratăm ca prima vizită.
    return false;
  }
}

export function rememberIntro(): void {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, String(Date.now()));
  } catch {
    // Fără stocare disponibilă — nu este o eroare, doar nu ținem minte.
  }
}

/** Interpolare 0→1 cu limitare la capete. */
export function progress(time: number, from: number, to: number): number {
  if (to <= from) return time >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (time - from) / (to - from)));
}

/** Accelerare — folosită pentru căderea bobului (gravitație). */
export function easeInQuad(t: number): number {
  return t * t;
}

/** Decelerare fină — folosită pentru deschiderea cortinei. */
export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -9 * t);
}
