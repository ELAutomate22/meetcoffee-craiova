import { site } from "@/data/site";
import { publishedFaq } from "@/data/faq";
import { rating } from "@/data/reviews";
import { schemaOpeningHours } from "@/lib/hours";

/**
 * Date structurate schema.org pentru Google.
 *
 * Regula respectată peste tot aici: se publică DOAR informații confirmate.
 * Coordonatele, programul și numărul de recenzii lipsesc din marcaj cât timp
 * nu sunt verificate — un marcaj cu date greșite este mai dăunător decât
 * absența lui și poate duce la penalizarea profilului local.
 */
export function StructuredData() {
  const openingHours = schemaOpeningHours();

  const coffeeShop: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${site.url}/#cafenea`,
    name: site.name,
    description: site.shortDescription,
    url: site.url,
    image: `${site.url}/images/intro/intro-fallback.webp`,
    priceRange: site.priceRange.schemaSymbol,
    currenciesAccepted: site.priceRange.currency,
    servesCuisine: "Cafea de specialitate",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.county,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
  };

  if (site.geo.latitude !== null && site.geo.longitude !== null) {
    coffeeShop.geo = {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    };
  }

  if (openingHours) {
    coffeeShop.openingHours = openingHours;
  }

  if (site.contact.phone) coffeeShop.telephone = site.contact.phone;
  if (site.contact.email) coffeeShop.email = site.contact.email;

  const sameAs = [site.social.instagram, site.social.facebook, site.social.google].filter(
    (url): url is string => Boolean(url),
  );
  if (sameAs.length > 0) coffeeShop.sameAs = sameAs;

  // `aggregateRating` cere un număr de recenzii pentru a fi valid. Cât timp
  // nu îl avem confirmat, omitem complet nota din datele structurate.
  if (rating.count !== null) {
    coffeeShop.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      bestRating: rating.best,
      reviewCount: rating.count,
    };
  }

  const faqPage =
    publishedFaq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: publishedFaq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coffeeShop) }}
      />
      {faqPage ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      ) : null}
    </>
  );
}
