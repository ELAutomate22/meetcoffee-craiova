/**
 * ============================================================================
 *  MeetCoffee — DATE DESPRE AFACERE  (fișierul principal de configurare)
 * ============================================================================
 *
 *  ACESTA ESTE SINGURUL FIȘIER pe care proprietarul trebuie să îl modifice
 *  pentru a actualiza informațiile publice ale site-ului.
 *
 *  Câmpurile marcate cu `null` NU sunt afișate pe site. Nu se inventează
 *  date de contact sau program. Când primești informația reală, înlocuiește
 *  `null` cu valoarea corectă și secțiunea va apărea automat.
 *
 *  Vezi DATE-DE-CONFIRMAT.md pentru lista completă a informațiilor lipsă.
 * ============================================================================
 */

/** O informație care poate lipsi. `null` = ascunsă complet din interfață. */
export type Optional<T> = T | null;

export const site = {
  name: "MeetCoffee",
  legalName: "MeetCoffee",

  /** Mesajul de brand principal. Apare în hero și în metadate. */
  tagline: "Cafeaua care ne aduce împreună.",
  taglineAlt: "Coffee worth meeting for.",

  /** Descriere scurtă folosită în hero și în datele structurate. */
  shortDescription:
    "Cafenea de specialitate în centrul Craiovei, cu cafea preparată atent și un spațiu gândit pentru întâlniri.",

  /** Furnizorul de cafea — informație confirmată de proprietar. */
  supplier: {
    label: "Cafea de specialitate by MABO Coffee",
    name: "MABO Coffee",
    /** URL-ul oficial MABO Coffee — DE CONFIRMAT. */
    url: null as Optional<string>,
  },

  address: {
    street: "Calea București 9, Bloc 13B, parter",
    postalCode: "200678",
    city: "Craiova",
    county: "Dolj",
    country: "România",
    countryCode: "RO",
    /** Adresa completă, pe un singur rând. */
    full: "Calea București 9, Bloc 13B, parter, 200678 Craiova, România",
    /** Context de zonă — verificat pe hartă. */
    areaNote: "Zona centrală a Craiovei, aproape de Centrul Vechi",
  },

  /**
   * Coordonate geografice — DE CONFIRMAT.
   * Nu sunt publicate în datele structurate cât timp sunt `null`, ca să nu
   * transmitem motoarelor de căutare o poziție aproximativă.
   */
  geo: {
    latitude: null as Optional<number>,
    longitude: null as Optional<number>,
  },

  /** Link-ul de hartă folosește căutarea după adresă — funcționează fără coordonate. */
  maps: {
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("MeetCoffee, Calea București 9, Craiova, România"),
    /**
     * URL de embed pentru iframe. Lăsat `null` intenționat: harta Google
     * încarcă scripturi terțe și cookie-uri. Cât timp este `null`, site-ul
     * afișează o previzualizare statică, fără urmărire. Vezi README.
     */
    embedUrl: null as Optional<string>,
  },

  contact: {
    /** Telefon — DE CONFIRMAT de proprietar. Format: "+40 7xx xxx xxx" */
    phone: null as Optional<string>,
    /** E-mail — DE CONFIRMAT de proprietar. */
    email: null as Optional<string>,
  },

  social: {
    /** URL complet de profil Instagram — DE CONFIRMAT. */
    instagram: null as Optional<string>,
    /** URL complet de pagină Facebook — DE CONFIRMAT. */
    facebook: null as Optional<string>,
    /** Link către profilul Google Business — DE CONFIRMAT. */
    google: null as Optional<string>,
  },

  /**
   * Program de funcționare — DE CONFIRMAT integral de proprietar.
   *
   * Cât timp `confirmed` este `false`, site-ul NU afișează ore și NU
   * calculează starea „Deschis acum”. Afișează în schimb un mesaj neutru.
   *
   * După confirmare: pune `confirmed: true` și completează `days`.
   * Format oră: "HH:MM" (24h). `null` pe o zi = închis în ziua respectivă.
   */
  openingHours: {
    confirmed: false,
    timezone: "Europe/Bucharest",
    /** 0 = duminică, 1 = luni ... 6 = sâmbătă (ca `Date.getDay()`). */
    days: [
      { day: 0, label: "Duminică", opens: null, closes: null },
      { day: 1, label: "Luni", opens: null, closes: null },
      { day: 2, label: "Marți", opens: null, closes: null },
      { day: 3, label: "Miercuri", opens: null, closes: null },
      { day: 4, label: "Joi", opens: null, closes: null },
      { day: 5, label: "Vineri", opens: null, closes: null },
      { day: 6, label: "Sâmbătă", opens: null, closes: null },
    ] as ReadonlyArray<{
      day: number;
      label: string;
      opens: Optional<string>;
      closes: Optional<string>;
    }>,
  },

  /** Interval de preț observat, per persoană. */
  priceRange: {
    min: 20,
    max: 40,
    currency: "RON",
    label: "20–40 lei de persoană",
    /** Simbolul folosit în datele structurate schema.org. */
    schemaSymbol: "$$",
  },

  /** URL-ul canonic de producție — se actualizează la publicare. */
  url: "https://meetcoffee.ro",
} as const;

export type Site = typeof site;
