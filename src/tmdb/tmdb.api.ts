import { tmdbGet } from "@/src/core/http/client";
import type { TmdbMovie, TmdbMovieDetails, TmdbPaginatedResponse } from "@/src/tmdb/tmdb.types";

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

export async function searchMovies(args: {
  query: string;
  page: number;
  signal?: AbortSignal;
}) {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    "/search/movie",
    {
      query: args.query,
      page: args.page,
      include_adult: false,
      language: "fr-FR",
    },
    args.signal,
  );
}

export async function getMovieDetails(args: {
  id: number;
  signal?: AbortSignal;
}) {
  return tmdbGet<TmdbMovieDetails>(
    `/movie/${args.id}`,
    {
      language: "fr-FR",
    },
    args.signal,
  );
}
