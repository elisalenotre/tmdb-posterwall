import { discoverMovies } from "@/src/tmdb/tmdb.api";
import type { TmdbMovie } from "@/src/tmdb/tmdb.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useDiscoverMovies() {
  const [items, setItems] = useState<TmdbMovie[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);

  const loadFirstPage = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const res = await discoverMovies({ page: 1, signal: controller.signal });
      setItems(res.results);
      setPage(1);
      setHasNextPage(res.page < res.total_pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }

    return () => controller.abort();
  }, []);

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    const nextPage = page + 1;
    const controller = new AbortController();

    try {
      const res = await discoverMovies({
        page: nextPage,
        signal: controller.signal,
      });

      // merge + anti-doublons (sécurité)
      setItems((prev) => {
        const map = new Map<number, TmdbMovie>();
        for (const m of prev) map.set(m.id, m);
        for (const m of res.results) map.set(m.id, m);
        return Array.from(map.values());
      });

      setPage(nextPage);
      setHasNextPage(res.page < res.total_pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }

    return () => controller.abort();
  }, [hasNextPage, page]);

  const refresh = useCallback(async () => {
    await loadFirstPage();
  }, [loadFirstPage]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  return useMemo(
    () => ({
      items,
      isLoading,
      isLoadingMore,
      error,
      hasNextPage,
      loadNextPage,
      refresh,
    }),
    [
      items,
      isLoading,
      isLoadingMore,
      error,
      hasNextPage,
      loadNextPage,
      refresh,
    ],
  );
}
