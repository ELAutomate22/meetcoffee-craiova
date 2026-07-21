import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { isProductionDomain } from "@/lib/deployment";

export default function robots(): MetadataRoute.Robots {
  // Adresele temporare (*.netlify.app, previzualizări de ramură) nu se indexează.
  // Vezi src/lib/deployment.ts pentru motiv.
  if (!isProductionDomain()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
