import { searchMovies } from "@/src/tmdb/tmdb.api";
import type { TmdbMovie } from "@/src/tmdb/tmdb.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useSearchMovies(query: string) {
  const [items, setItems] = useState<TmdbMovie[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);

  const loadFirstPage = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      setItems([]);
      setPage(1);
      setHasNextPage(false);
      setError(null);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const res = await searchMovies({
        query: q,
        page: 1,
        signal: controller.signal,
      });
      setItems(res.results);
      setPage(1);
      setHasNextPage(res.page < res.total_pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [query]);

  const loadNextPage = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    if (!hasNextPage) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    const nextPage = page + 1;
    const controller = new AbortController();

    try {
      const res = await searchMovies({
        query: q,
        page: nextPage,
        signal: controller.signal,
      });

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
  }, [query, hasNextPage, page]);

  const refresh = useCallback(async () => {
    await loadFirstPage();
  }, [loadFirstPage]);

  // relance une recherche quand la query change (debounce fait en amont)
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
