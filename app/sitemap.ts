import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

const base = "https://www.rrameshartsstudio.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticРaths = [
    "",
    "/collections",
    "/collections/dashboard-idols",
    "/collections/shadu-mati-idols",
    "/collections/fiber-idols",
    "/collections/pop-idols",
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

  const staticRoutes: MetadataRoute.Sitemap = staticРaths.map((path) => ({
    url: base + path,
    lastModified: new Date(),
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
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