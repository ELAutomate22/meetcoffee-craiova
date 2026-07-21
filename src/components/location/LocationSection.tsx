import Image from "next/image";
import { site } from "@/data/site";
import { weekOrdered } from "@/lib/hours";
import { OpenStatus } from "./OpenStatus";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Secțiunea de locație.
 *
 * Harta încorporată de la Google încarcă scripturi și cookie-uri terțe, deci
 * nu o punem implicit. Cât timp `site.maps.embedUrl` este `null`, afișăm o
 * previzualizare proprie și un link către Google Maps. Zero urmărire, aceeași
 * utilitate pentru vizitator.
 */
export function LocationSection() {
  const hoursConfirmed = site.openingHours.confirmed;

  return (
    <section
      id="locatie"
      className="scroll-mt-28 border-t border-ivory/5 py-24 md:py-32"
      aria-labelledby="locatie-titlu"
    >
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal as="p" className="eyebrow mb-5">
              Locație
            </Reveal>
            <Reveal delay={80}>
              <h2 id="locatie-titlu" className="text-4xl text-ivory sm:text-5xl lg:text-6xl">
                Ne găsești în centrul Craiovei.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <address className="mt-8 not-italic text-lg leading-relaxed text-muted">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.country}
              </address>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-3 text-sm text-taupe">{site.address.areaNote}</p>
            </Reveal>

            <Reveal delay={260}>
              <a
                href={site.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-[999px] bg-crema px-7 py-3.5 font-medium text-espresso transition-transform duration-300 hover:scale-[1.03] hover:bg-ivory"
              >
                Deschide în Google Maps
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(se deschide într-o filă nouă)</span>
              </a>
            </Reveal>

            {/* Program */}
            <Reveal delay={320}>
              <div className="mt-14 border-t border-ivory/10 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="font-display text-2xl text-ivory">Program</h3>
                  <OpenStatus className="text-sm" />
                </div>

                {hoursConfirmed ? (
                  <dl className="mt-6 space-y-1">
                    {weekOrdered.map((day) => (
                      <div
                        key={day.day}
                        className="flex items-baseline justify-between gap-4 border-b border-ivory/5 py-3 text-sm"
                      >
                        <dt className="text-muted">{day.label}</dt>
                        <dd className="text-ivory">
                          {day.opens && day.closes
                            ? `${day.opens} – ${day.closes}`
                            : "Închis"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-muted">
                    Programul complet va fi publicat în curând. Până atunci, îl
                    găsești actualizat pe profilul nostru de Google Maps.
                  </p>
                )}
              </div>
            </Reveal>

            {/* Contact — se afișează doar câmpurile confirmate. */}
            {site.contact.phone || site.contact.email ? (
              <Reveal delay={380}>
                <div className="mt-12 border-t border-ivory/10 pt-8">
                  <h3 className="font-display text-2xl text-ivory">Contact</h3>
                  <ul className="mt-5 space-y-3 text-muted">
                    {site.contact.phone ? (
                      <li>
                        <a
                          href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                          className="transition-colors hover:text-crema"
                        >
                          {site.contact.phone}
                        </a>
                      </li>
                    ) : null}
                    {site.contact.email ? (
                      <li>
                        <a
                          href={`mailto:${site.contact.email}`}
                          className="transition-colors hover:text-crema"
                        >
                          {site.contact.email}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Previzualizare hartă */}
          <Reveal delay={200}>
            <div className="relative h-full min-h-[26rem] overflow-hidden rounded-[var(--radius-card)] border border-ivory/10">
              {site.maps.embedUrl ? (
                <iframe
                  src={site.maps.embedUrl}
                  title="Harta locației MeetCoffee"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <a
                  href={site.maps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group absolute inset-0 block"
                >
                  <Image
                    src="/images/gallery/terrace.webp"
                    alt="Stradă din centrul Craiovei, în apropierea cafenelei"
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent" />

                  <span className="absolute inset-x-0 bottom-0 p-8">
                    <span className="flex items-center gap-3 font-display text-2xl text-ivory">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-crema/40 text-crema"
                      >
                        ◎
                      </span>
                      {site.address.street}
                    </span>
                    <span className="mt-3 block text-sm text-muted">
                      {site.address.postalCode} {site.address.city} · apasă
                      pentru indicații rutiere
                    </span>
                  </span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
