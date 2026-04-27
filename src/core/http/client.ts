import { ENV } from "@/src/core/config/.env";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params?: QueryParams) {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function tmdbGet<T>(
  path: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<T> {
  const url = `${ENV.TMDB_BASE_URL}${path}${buildQuery(params)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ENV.TMDB_TOKEN}`,
      accept: "application/json",
    },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB error ${res.status} - ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}
