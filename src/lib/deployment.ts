import { site } from "@/data/site";

/**
 * ============================================================================
 *  Pe ce domeniu rulează publicarea curentă?
 * ============================================================================
 *
 *  Site-ul poate fi publicat pe mai multe adrese: domeniul real, o adresă
 *  temporară `*.netlify.app` sau `*.vercel.app`, plus previzualizări pentru
 *  fiecare ramură.
 *
 *  Doar domeniul real trebuie indexat de Google. Adresele temporare conțin
 *  aceleași texte — inclusiv prețurile date ca exemplu, neconfirmate încă de
 *  proprietar — iar indexarea lor ar însemna două lucruri nedorite: conținut
 *  duplicat în căutări și prețuri orientative afișate ca informație oficială.
 *
 *  Valoarea se citește la momentul build-ului, din variabilele puse automat de
 *  platforma de găzduire. Nu trebuie configurat nimic manual.
 * ============================================================================
 */

/** Adresa pe care platforma o consideră principală pentru această publicare. */
function deploymentUrl(): string | null {
  return (
    process.env.URL ?? // Netlify: adresa principală a site-ului
    process.env.DEPLOY_PRIME_URL ?? // Netlify: adresa acestei publicări
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ??
    null
  );
}

/**
 * `true` dacă publicarea curentă rulează pe domeniul real din `site.url`.
 *
 * În dezvoltare locală (fără variabile de platformă) returnează `true`, ca
 * `robots.txt` să arate exact ca în producție atunci când îl verifici.
 */
export function isProductionDomain(): boolean {
  const current = deploymentUrl();
  if (current === null) return true;

  try {
    return new URL(current).host === new URL(site.url).host;
  } catch {
    // Adresă neinterpretabilă: alegem varianta prudentă și nu indexăm.
    return false;
  }
}
