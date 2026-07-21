import Link from "next/link";
import { site } from "@/data/site";
import { OpenStatus } from "@/components/location/OpenStatus";

/** Rețelele sociale confirmate. Cele necompletate nu se afișează deloc. */
const socialLinks = [
  { key: "instagram", label: "Instagram", href: site.social.instagram },
  { key: "facebook", label: "Facebook", href: site.social.facebook },
  { key: "google", label: "Google", href: site.social.google },
].filter((link): link is { key: string; label: string; href: string } =>
  Boolean(link.href),
);

/** Linkurile legale din subsol. `py-1.5` le duce peste ținta minimă de 24 px. */
const legalLinks = [
  { href: "/confidentialitate", label: "Confidențialitate" },
  { href: "/cookies", label: "Cookie-uri" },
  { href: "/accesibilitate", label: "Accesibilitate" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="scroll-mt-28 border-t border-ivory/10 bg-void pt-24"
      aria-labelledby="contact-titlu"
    >
      <div className="container-page">
        <div className="grid gap-14 pb-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h2 id="contact-titlu" className="font-display text-3xl text-ivory">
              Meet<span className="text-crema">Coffee</span>
            </h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted">
              {site.tagline}
            </p>
            <p className="mt-6 text-sm text-taupe">{site.supplier.label}</p>
          </div>

          <div>
            <h3 className="eyebrow mb-5">Locație</h3>
            <address className="not-italic leading-relaxed text-muted">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              <br />
              {site.address.country}
            </address>
            <a
              href={site.maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block py-1.5 text-sm text-crema transition-colors hover:text-ivory"
            >
              Deschide în Google Maps
              <span className="sr-only"> (se deschide într-o filă nouă)</span>
            </a>
          </div>

          <div>
            <h3 className="eyebrow mb-5">Program</h3>
            <OpenStatus className="text-sm" />

            {/*
              Contactul și rețelele sociale apar aici doar după ce
              proprietarul confirmă datele. Vezi src/data/site.ts.
            */}
            {site.contact.phone || site.contact.email || socialLinks.length > 0 ? (
              <div className="mt-8">
                <h3 className="eyebrow mb-5">Urmărește-ne</h3>
                <ul className="text-muted">
                  {site.contact.phone ? (
                    <li>
                      <a
                        href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                        className="inline-block py-1.5 transition-colors hover:text-crema"
                      >
                        {site.contact.phone}
                      </a>
                    </li>
                  ) : null}
                  {site.contact.email ? (
                    <li>
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="inline-block py-1.5 transition-colors hover:text-crema"
                      >
                        {site.contact.email}
                      </a>
                    </li>
                  ) : null}
                  {socialLinks.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1.5 transition-colors hover:text-crema"
                      >
                        {link.label}
                        <span className="sr-only"> (se deschide într-o filă nouă)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-relaxed text-taupe">
                Detalii de contact disponibile în curând.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ivory/10 py-8 text-sm text-taupe md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. Toate drepturile rezervate.
          </p>
          <nav aria-label="Informații legale">
            <ul className="flex flex-wrap gap-x-7">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1.5 transition-colors hover:text-crema"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
