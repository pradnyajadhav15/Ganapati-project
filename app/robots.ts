import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/checkout"],
    },
    sitemap: "https://www.rrameshartsstudio.in/sitemap.xml",
  };
}