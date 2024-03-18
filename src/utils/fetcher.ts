interface CacheEntry {
  expiry: number;
  data: any;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetcher = async (url: string, options: RequestInit) => {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const now = Date.now();

  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiry > now) {
    return cachedEntry.data;
  }

  const res = await fetch(url, options);
  const data = await res.json();

  cache.set(cacheKey, { expiry: now + CACHE_DURATION, data });

  return data;
};

export default fetcher;
