import { supabase } from "@/lib/supabase";

export type Testimonial = {
  id: string;
  quote: string;
  customer_name: string;
  city: string | null;
  rating: number;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as Testimonial[];
}
