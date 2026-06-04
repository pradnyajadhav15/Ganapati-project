import { supabase } from "@/lib/supabase";

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as GalleryImage[];
}
