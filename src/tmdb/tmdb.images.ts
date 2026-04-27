import { ENV } from "@/src/core/config/.env";

export function tmdbPosterUrl(
  posterPath: string | null,
  size: "w342" | "w500" = "w342",
) {
  if (!posterPath) return null;
  return `${ENV.TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}
