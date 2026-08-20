import type { MetadataRoute } from "next";

const base = "https://www.rramesharts.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/collections",
    "/collections/dashboard-idols",
    "/collections/shadu-mati-idols",
    "/collections/fiber-idols",
    "/collections/pop-idols",
    "/collections/accessories",
    "/materials",
    "/care",
    "/shop",
    "/faq",
    "/our-work",
    "/blog",
    "/about",
    "/contact",
    "/customized-work",
    "/initiative",
    "/partnership",
    "/media-coverage",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/shipping-policy",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: base + path,
    lastModified: new Date(),
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { getProducts } = await import("@/lib/products");
    const products = await getProducts();
    productRoutes = products.map((p) => ({
      url: base + "/product/" + p.id,
      lastModified: new Date(),
    }));
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes];
}
