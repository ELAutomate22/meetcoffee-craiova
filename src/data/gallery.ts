/**
 * ============================================================================
 *  MeetCoffee — GALERIE
 * ============================================================================
 *
 *  ⚠️  Imaginile actuale sunt GENERATE, folosite ca substitut vizual până la
 *  primirea fotografiilor reale ale cafenelei. Vezi ASSETS.md.
 *
 *  Ca să înlocuiești o imagine:
 *    1. pune fotografia în /public/images/gallery/ cu ACELAȘI nume de fișier;
 *    2. actualizează `alt` cu o descriere reală a fotografiei;
 *    3. verifică `width`/`height` (raportul corect previne saltul de layout);
 *    4. pune `generated: false`.
 *
 *  `span` controlează dimensiunea în grila editorială (1 = normal, 2 = mare).
 * ============================================================================
 */

export type GalleryImage = {
  src: string;
  /** Text alternativ, în română — obligatoriu pentru accesibilitate. */
  alt: string;
  width: number;
  height: number;
  /** Legendă scurtă afișată la mărire. */
  caption: string;
  span?: 1 | 2;
  /** `true` = imagine generată, nu fotografie reală a locației. */
  generated: boolean;
};

export const gallery: GalleryImage[] = [
  {
    src: "/images/gallery/interior-01.webp",
    alt: "Interior de cafenea cu mese de marmură, lemn închis la culoare și lumină caldă de după-amiază",
    width: 1536,
    height: 1024,
    caption: "Spațiul interior, în lumina de după-amiază",
    span: 2,
    generated: true,
  },
  {
    src: "/images/gallery/latte-art.webp",
    alt: "Lapte texturat turnat peste espresso, formând un desen în formă de lalea",
    width: 1024,
    height: 1536,
    caption: "Turnare manuală, ceașcă cu ceașcă",
    generated: true,
  },
  {
    src: "/images/gallery/extraction.webp",
    alt: "Espresso curgând din grupul unui espressor profesional într-un pahar mic",
    width: 1024,
    height: 1536,
    caption: "Extragerea, urmărită la secundă",
    generated: true,
  },
  {
    src: "/images/gallery/beans.webp",
    alt: "Boabe de cafea proaspăt prăjite, răsturnate pe o suprafață închisă de ardezie",
    width: 1024,
    height: 1024,
    caption: "Boabe proaspăt prăjite",
    generated: true,
  },
  {
    src: "/images/gallery/terrace.webp",
    alt: "Terasă de cafenea pe o stradă din centrul vechi, dimineața devreme, cu mese pregătite",
    width: 1536,
    height: 1024,
    caption: "Dimineața devreme, înainte de prima ceașcă",
    span: 2,
    generated: true,
  },
  {
    src: "/images/gallery/v60.webp",
    alt: "Set complet pentru cafea filtrată V60: carafă de sticlă, dripper ceramic și ibric cu gât subțire",
    width: 1024,
    height: 1024,
    caption: "V60, preparat la comandă",
    generated: true,
  },
  {
    src: "/images/gallery/meeting.webp",
    alt: "Doi prieteni stând la o masă de cafenea, cu două cești între ei",
    width: 1536,
    height: 1024,
    caption: "Motivul pentru care existăm",
    generated: true,
  },
  {
    src: "/images/gallery/pastries.webp",
    alt: "Croissant, cheesecake și rulou cu scorțișoară pe o farfurie închisă la culoare, lângă o ceașcă de cafea",
    width: 1536,
    height: 1024,
    caption: "Ce merge alături de cafea",
    generated: true,
  },
];

/** `true` dacă galeria conține încă imagini generate. */
export const galleryHasGeneratedImages = gallery.some((i) => i.generated);
