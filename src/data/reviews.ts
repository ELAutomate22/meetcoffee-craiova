/**
 * ============================================================================
 *  MeetCoffee — RECENZII
 * ============================================================================
 *
 *  Recenziile de mai jos sunt FRAGMENTE din recenzii publice Google, oferite
 *  de proprietar. Sunt reproduse ca extrase și pot necesita verificare finală.
 *
 *  ⚠️  Nu adăuga recenzii inventate. Nu modifica textul recenziilor reale.
 *
 *  `rating.count` este `null` pentru că sursele disponibile indicau numere
 *  diferite de recenzii. Cât timp este `null`, site-ul afișează nota, dar NU
 *  afirmă un număr de recenzii, iar datele structurate nu includ `reviewCount`.
 *  Completează-l doar cu numărul exact citit din profilul Google.
 * ============================================================================
 */

export const rating = {
  /** Nota medie afișată public. */
  value: 4.9,
  best: 5,
  /** Numărul total de recenzii — DE CONFIRMAT din profilul Google. */
  count: null as number | null,
  source: "Google",
};

export type Review = {
  id: string;
  /** Numele recenzentului. `null` = recenzie afișată fără nume. */
  author: string | null;
  /** Textul recenziei, ca extras. */
  quote: string;
  stars: number;
  source: "Google";
  /** `true` dacă textul este o traducere/parafrază, nu citat exact. */
  paraphrased?: boolean;
};

export const reviews: Review[] = [
  {
    id: "r1",
    author: null,
    quote:
      "Un loc minunat de întâlnire, cu oameni prietenoși și cafea cu adevărat delicioasă. Atmosfera este primitoare, iar fiecare ceașcă este preparată cu grijă. Perfect pentru conversații bune și un moment de relaxare.",
    stars: 5,
    source: "Google",
    paraphrased: true,
  },
  {
    id: "r2",
    author: null,
    quote: "Cea mai bună din oraș ❤️",
    stars: 5,
    source: "Google",
    paraphrased: true,
  },
  {
    id: "r3",
    author: null,
    quote:
      "Am ajuns dis-de-dimineață și am prins momentul în care se pregăteau mesele de afară. Se vedea grija pentru fiecare detaliu, încă dinainte să se deschidă ziua.",
    stars: 5,
    source: "Google",
    paraphrased: true,
  },
];
