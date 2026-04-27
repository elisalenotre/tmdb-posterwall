import { tmdbGet } from "@/src/core/http/client";
import type { TmdbMovie, TmdbPaginatedResponse } from "@/src/tmdb/tmdb.types";

export async function discoverMovies(args: {
  page: number;
  signal?: AbortSignal;
}) {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    "/discover/movie",
    {
      page: args.page,
      include_adult: false,
      language: "fr-FR",
      sort_by: "popularity.desc",
    },
    args.signal,
  );
}
