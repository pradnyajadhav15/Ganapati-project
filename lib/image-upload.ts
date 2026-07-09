import { supabaseAdmin } from "@/lib/supabase-admin";
import sharp from "sharp";

export async function uploadCompressedImage(file: File, prefix = ""): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const compressed = await sharp(bytes)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78 })
    .toBuffer();

  const path = prefix + Date.now() + "-" + Math.random().toString(36).slice(2) + ".jpg";
  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);

  return supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}
