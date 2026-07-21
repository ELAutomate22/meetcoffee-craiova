/**
 * ============================================================================
 *  MeetCoffee — ÎNTREBĂRI FRECVENTE
 * ============================================================================
 *
 *  `needsConfirmation: true` marchează răspunsurile care depind de politica
 *  reală a cafenelei și pe care proprietarul trebuie să le confirme.
 *
 *  Aceste întrebări NU sunt afișate pe site și NU intră în datele structurate
 *  cât timp sunt marcate astfel — ca să nu prezentăm drept sigur ceva
 *  neverificat. După confirmare, șterge linia `needsConfirmation` și
 *  întrebarea apare automat.
 * ============================================================================
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** `true` = ascunsă din site până la confirmarea proprietarului. */
  needsConfirmation?: boolean;
};

export const faq: FaqItem[] = [
  {
    id: "specialty",
    question: "Ce înseamnă cafea de specialitate?",
    answer:
      "Este cafea evaluată profesionist și punctată peste 80 din 100, cu origine cunoscută și prăjire recentă. În practică înseamnă boabe trasabile, prăjite pentru a scoate în evidență aroma proprie, nu pentru a o acoperi, și preparate după rețete măsurate. La MeetCoffee lucrăm cu cafea de specialitate prăjită de MABO Coffee.",
  },
  {
    id: "unde",
    question: "Unde se află MeetCoffee?",
    answer:
      "Pe Calea București 9, Bloc 13B, parter, în zona centrală a Craiovei, la câțiva pași de Centrul Vechi. Poți deschide adresa direct în Google Maps din secțiunea Locație.",
  },
  {
    id: "lapte-vegetal",
    question: "Aveți opțiuni cu lapte vegetal?",
    answer:
      "Da. Majoritatea băuturilor cu lapte pot fi preparate cu alternative vegetale. Pentru sortimentele disponibile în ziua respectivă, întreabă baristul.",
    needsConfirmation: true,
  },
  {
    id: "decofeinizat",
    question: "Aveți băuturi fără cofeină?",
    answer:
      "Da. Pe lângă ceaiuri, infuzii și ciocolată caldă, putem prepara băuturile cu espresso în variantă decofeinizată.",
    needsConfirmation: true,
  },
  {
    id: "laptop",
    question: "Pot lucra de la laptop?",
    answer:
      "Da, spațiul este potrivit pentru câteva ore de lucru liniștit. În intervalele aglomerate te rugăm să ții cont și de ceilalți vizitatori.",
    needsConfirmation: true,
  },
  {
    id: "animale",
    question: "Acceptați animale de companie?",
    answer:
      "Da, prietenii patrupezi sunt bineveniți pe terasă.",
    needsConfirmation: true,
  },
  {
    id: "sezon",
    question: "Aveți produse de sezon?",
    answer:
      "Da. Pe lângă meniul constant, pregătim băuturi și deserturi care se schimbă odată cu sezonul. Le găsești marcate cu eticheta „Sezonier” în meniu.",
  },
  {
    id: "rezervari",
    question: "Se pot face rezervări?",
    answer:
      "Momentan nu preluăm rezervări online. Pentru grupuri mai mari, cel mai simplu este să treci pe la noi sau să ne scrii pe rețelele sociale.",
    needsConfirmation: true,
  },
];

/** Doar întrebările confirmate — folosite în UI și în datele structurate. */
export const publishedFaq = faq.filter((item) => !item.needsConfirmation);
