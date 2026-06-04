// Lightweight bot detection for public forms.
// "website" is a honeypot: a field hidden from humans, so any value means a bot.
// elapsedMs is how long the form was on screen before submitting; near-instant = bot.
export function isLikelySpam(input: { website?: string; elapsedMs?: number }): boolean {
  if (input.website && input.website.trim().length > 0) return true;
  if (typeof input.elapsedMs === "number" && input.elapsedMs >= 0 && input.elapsedMs < 1000) return true;
  return false;
}
