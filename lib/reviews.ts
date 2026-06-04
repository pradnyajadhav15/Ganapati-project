import { supabase } from "./supabase";

export type Review = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type RatingSummary = {
  average: number;
  count: number;
};

export async function getReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id,product_id,customer_name,rating,comment,created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getReviews:", error.message);
    return [];
  }
  return (data ?? []) as Review[];
}

export async function getRatingSummary(productId: string): Promise<RatingSummary> {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);
  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = data.reduce((s, r) => s + (r.rating as number), 0);
  return { average: sum / data.length, count: data.length };
}