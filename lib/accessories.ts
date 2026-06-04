import { supabase } from "@/lib/supabase";

export type Accessory = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export async function getAccessories(): Promise<Accessory[]> {
  const { data, error } = await supabase
    .from("accessories")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as Accessory[];
}
