/**
 * ============================================================================
 *  MeetCoffee — MENIU
 * ============================================================================
 *
 *  ⚠️  IMPORTANT — DATE DEMONSTRATIVE
 *
 *  Produsele și prețurile de mai jos sunt EXEMPLE editabile, folosite pentru
 *  a construi site-ul. NU reprezintă oferta reală confirmată a cafenelei.
 *  Site-ul afișează vizitatorilor o notă clară în acest sens atât timp cât
 *  `menuMeta.confirmed` este `false`.
 *
 *  Cum se actualizează:
 *    1. Înlocuiește denumirile, descrierile și prețurile cu cele reale.
 *    2. Șterge produsele care nu se regăsesc în meniu.
 *    3. Când meniul este complet și verificat, pune `confirmed: true`
 *       — nota demonstrativă dispare automat de pe site.
 * ============================================================================
 */

export const menuMeta = {
  /** `false` = site-ul avertizează că meniul este orientativ. */
  confirmed: false,
  /** Data ultimei actualizări a meniului (se afișează dacă `confirmed`). */
  updatedAt: null as string | null,
};

export type MenuBadge = "Popular" | "Nou" | "Sezonier";

export type MenuItem = {
  id: string;
  name: string;
  /** Descriere scurtă, în română. */
  description: string;
  /** Ingrediente sau metodă de preparare. */
  detail?: string;
  /** Gramaj sau volum. */
  size?: string;
  /** Preț în lei. `null` = preț neafișat. */
  price: number | null;
  badge?: MenuBadge;
  /** Etichete alimentare, ex. „Se poate prepara cu lapte vegetal”. */
  dietary?: string[];
};

export type MenuCategory = {
  id: string;
  name: string;
  /** Text introductiv scurt pentru categorie. */
  blurb: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "espresso",
    name: "Espresso",
    blurb:
      "Baza tuturor băuturilor noastre. Extragere urmărită la gram și la secundă, din cafea proaspăt prăjită.",
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "Un shot concentrat, cu crema densă și final dulce-cacao.",
        detail: "18 g cafea măcinată, extragere 25–30 de secunde",
        size: "30 ml",
        price: 9,
        badge: "Popular",
      },
      {
        id: "espresso-dublu",
        name: "Espresso dublu",
        description: "Două shoturi pentru diminețile care cer puțin mai mult.",
        detail: "Aceeași rețetă, dublu volum",
        size: "60 ml",
        price: 12,
      },
      {
        id: "cortado",
        name: "Cortado",
        description:
          "Espresso echilibrat cu o cantitate egală de lapte texturat fin.",
        detail: "Espresso și lapte în proporții egale",
        size: "120 ml",
        price: 13,
        dietary: ["Se poate prepara cu lapte vegetal"],
      },
      {
        id: "americano",
        name: "Americano",
        description: "Espresso lungit cu apă fierbinte, blând și limpede.",
        size: "200 ml",
        price: 11,
      },
    ],
  },
  {
    id: "cu-lapte",
    name: "Cu lapte",
    blurb:
      "Lapte texturat până devine mătăsos, turnat cu mâna. Fără spumă uscată, fără compromisuri.",
    items: [
      {
        id: "cappuccino",
        name: "Cappuccino",
        description:
          "Clasicul echilibrat: espresso, lapte cremos și un strat fin de spumă.",
        size: "180 ml",
        price: 14,
        badge: "Popular",
        dietary: ["Se poate prepara cu lapte vegetal"],
      },
      {
        id: "flat-white",
        name: "Flat White",
        description:
          "Mai intens decât un cappuccino, cu textura densă și catifelată a laptelui.",
        detail: "Espresso dublu și lapte microtexturat",
        size: "200 ml",
        price: 16,
        dietary: ["Se poate prepara cu lapte vegetal"],
      },
      {
        id: "caffe-latte",
        name: "Caffè Latte",
        description: "Blând și lung, pentru dimineți fără grabă.",
        size: "300 ml",
        price: 16,
        dietary: ["Se poate prepara cu lapte vegetal"],
      },
      {
        id: "matcha-latte",
        name: "Matcha Latte",
        description:
          "Matcha ceremonial, bătut manual, peste lapte cald sau rece.",
        size: "300 ml",
        price: 18,
        dietary: ["Fără cofeină din cafea", "Se poate prepara cu lapte vegetal"],
      },
    ],
  },
  {
    id: "filtru",
    name: "Filtru",
    blurb:
      "Metode manuale, pentru cafelele la care aroma contează mai mult decât intensitatea.",
    items: [
      {
        id: "v60",
        name: "V60",
        description:
          "Filtrare manuală care scoate în față aciditatea și notele florale ale boabelor.",
        detail: "Preparat la comandă, aproximativ 4 minute",
        size: "250 ml",
        price: 17,
      },
      {
        id: "batch-brew",
        name: "Cafea de filtru",
        description: "Preparată în loturi mici, gata imediat, la fel de atent dozată.",
        size: "250 ml",
        price: 12,
      },
      {
        id: "cold-brew",
        name: "Cold Brew",
        description:
          "Extragere la rece, 16 ore. Dulce natural, cu corp catifelat și fără amăreală.",
        detail: "Se prepară cu o zi înainte",
        size: "300 ml",
        price: 17,
        badge: "Sezonier",
      },
    ],
  },
  {
    id: "rece",
    name: "Rece",
    blurb: "Pentru zilele lungi de vară și pentru serile de pe terasă.",
    items: [
      {
        id: "iced-latte",
        name: "Iced Latte",
        description: "Espresso peste gheață și lapte rece, simplu și corect.",
        size: "350 ml",
        price: 17,
        dietary: ["Se poate prepara cu lapte vegetal"],
      },
      {
        id: "espresso-tonic",
        name: "Espresso Tonic",
        description:
          "Espresso peste tonic și gheață, cu o felie de citrice. Efervescent și răcoritor.",
        size: "300 ml",
        price: 19,
        badge: "Nou",
      },
      {
        id: "limonada",
        name: "Limonadă de casă",
        description: "Preparată zilnic, cu fructe proaspete de sezon.",
        size: "400 ml",
        price: 15,
        badge: "Sezonier",
      },
    ],
  },
  {
    id: "altele",
    name: "Altele",
    blurb: "Ce bem când nu bem cafea — și ce mâncăm alături de ea.",
    items: [
      {
        id: "ciocolata-calda",
        name: "Ciocolată caldă",
        description: "Ciocolată neagră topită în lapte cald, densă și puțin amăruie.",
        size: "250 ml",
        price: 16,
        dietary: ["Fără cofeină din cafea"],
      },
      {
        id: "ceai",
        name: "Ceai",
        description:
          "Selecție de ceaiuri în frunze: negru, verde și infuzii fără cofeină.",
        size: "400 ml",
        price: 12,
        dietary: ["Opțiuni fără cofeină"],
      },
      {
        id: "croissant",
        name: "Croissant",
        description: "Unt adevărat, foietaj crocant. Adus proaspăt în fiecare dimineață.",
        price: 10,
      },
      {
        id: "desert-zi",
        name: "Desertul zilei",
        description:
          "Se schimbă des, în funcție de ce este bun în sezon. Întreabă baristul.",
        price: null,
        badge: "Sezonier",
      },
    ],
  },
];
