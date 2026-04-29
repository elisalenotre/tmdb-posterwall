import { getMovieDetails } from "@/src/tmdb/tmdb.api";
import type { TmdbMovieDetails } from "@/src/tmdb/tmdb.types";
import { useEffect, useMemo, useState } from "react";

export function useMovieDetails(id: number | null) {
  const [data, setData] = useState<TmdbMovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getMovieDetails({ id, signal: controller.signal })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [id]);

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error]);
}
