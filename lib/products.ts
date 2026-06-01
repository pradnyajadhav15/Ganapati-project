import { supabase } from "./supabase";

export type Category = "dashboard-idols" | "shadu-mati-idols" | "fiber-idols" | "pop-idols";

export type Product = {
  id: string;
  name: string;
  price: number; // rupees
  category: Category;
  size: string | null;
  tag: string | null;
  description: string | null;
  image_url: string | null;
  in_stock: boolean;
  created_at?: string;
};

export const CATEGORY_META: Record<Category, { title: string; blurb: string }> = {
  "dashboard-idols": {
    title: "Dashboard Idols",
    blurb: "Compact idols crafted for car dashboards and small altars.",
  },
  "shadu-mati-idols": {
    title: "Shadu Mati Idols",
    blurb: "100% natural clay idols that dissolve cleanly back into water.",
  },
  "fiber-idols": {
    title: "Fiber Idols",
    blurb: "Lightweight, durable fiber idols for reuse and display.",
  },

  "pop-idols": {
    title: "Pop Idols",
    blurb: "Finely detailed plaster idols with a smooth painted finish.",
  },
};

;
export { formatINR } from "./format";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductsByCategory(c: Category): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", c)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProductsByCategory:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Product;
}
