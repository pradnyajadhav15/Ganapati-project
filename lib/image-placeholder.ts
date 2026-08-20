/**
 * Shared blur-up placeholder for remote images.
 *
 * next/image can only derive a blur automatically from a statically imported
 * file. Product, accessory and gallery photos live in Supabase storage, so
 * they need an explicit blurDataURL or they pop in abruptly once loaded.
 *
 * This is an 8x8 cream-to-peach wash matching the card surfaces the images sit
 * on, so a photo fades up out of its own background rather than out of grey.
 * A per-image blur generated at upload time would be truer still — see the
 * note in lib/image-upload.ts.
 */
export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAVEAEBAAAAAAAAAAAAAAAAAAAAEv/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8AqLAGSP/Z";
