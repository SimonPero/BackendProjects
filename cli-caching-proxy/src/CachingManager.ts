import { CacheEntry } from "../utils/types/CacheEntry";

export default class CachingManager {
  private readonly MAX_CACHE_SIZE = 20;
  private readonly STALENESS_THRESHOLD = 24 * 60 * 60 * 1000; // 1 day
  private readonly SCORE_THRESHOLD = 0.8;

  private readonly TTL_DEFAULTS = new Map<string, number>([
    ["image/*", 7 * 24 * 60 * 60 * 1000],
    ["text/css", 24 * 60 * 60 * 1000],
    ["application/javascript", 24 * 60 * 60 * 1000],
    ["application/json", 5 * 60 * 1000],
    ["text/html", 60 * 60 * 1000],
    ["GET", 24 * 60 * 60 * 1000],
    ["POST", 0],
    ["PUT", 0],
    ["DELETE", 0],
  ]);

  private calculateScore(entry: CacheEntry): number {
    const lastTime = new Date(entry.last_access_time).getTime();
    const staleness = Date.now() - lastTime;
    const weight1 = 0.7;
    const weight2 = 0.3;

    const normalizedStaleness = Math.min(
      staleness / this.STALENESS_THRESHOLD,
      1
    );
    const frequencyScore = 1 / (entry.hits + 1);
    const score = normalizedStaleness * weight1 + frequencyScore * weight2;

    return score;
  }
  private determineTTL(contentType: string, method: string): number {
    if (this.TTL_DEFAULTS.get(method) === 0) {
      return 0;
    }

    for (const [type, ttl] of this.TTL_DEFAULTS.entries()) {
      if (type.endsWith("*") && contentType.startsWith(type.slice(0, -1))) {
        return ttl;
      }
      if (type === contentType) {
        return ttl;
      }
    }

    return 15 * 60 * 1000; // 15 minutes
  }

  async addToCache(
    cacheData: CacheEntry[],
    method: string,
    requestUrl: string,
    response: Response,
    mimeType: string
  ): Promise<CacheEntry[]> {
    try {
      const ttlMillis = this.determineTTL(mimeType, method);

      const responseBody = await response.clone().text();
      const responseHeaders = Array.from(response.headers.entries()).reduce(
        (headers: Record<string, string>, [key, value]) => {
          headers[key] = value;
          return headers;
        },
        {}
      );

      const cacheEntry: CacheEntry = {
        method,
        request: requestUrl,
        res: {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          body: responseBody,
          mimeType,
        },
        hits: 0,
        creation_time: new Date(),
        last_access_time: new Date(),
        ttl: new Date(Date.now() + ttlMillis),
      };

      cacheData.push(cacheEntry);
      return cacheData;
    } catch (error) {
      console.error("Error adding to cache:", error);
      return cacheData;
    }
  }

  async evictFromCache(
    cache: Array<CacheEntry>,
    method: string,
    request: string
  ): Promise<Array<CacheEntry>> {
    return cache.filter(
      (entry) => !(entry.method === method && entry.request === request)
    );
  }

  async batchEvict(cache: Array<CacheEntry>): Promise<Array<CacheEntry>> {
    const now = Date.now();
    return cache.filter((entry) => {
      const ttlTime = new Date(entry.ttl).getTime();
      const lastAccessTime = new Date(entry.last_access_time).getTime();

      console.log(`TTL valid: ${ttlTime > now}`);
      console.log(
        `Within staleness threshold: ${
          now - lastAccessTime <= this.STALENESS_THRESHOLD
        }`
      );
      console.log(
        `Score within threshold: ${
          this.calculateScore(entry) <= this.SCORE_THRESHOLD
        }`
      );

      // Keep entry if all conditions are met
      return (
        ttlTime > now &&
        now - lastAccessTime <= this.STALENESS_THRESHOLD &&
        this.calculateScore(entry) <= this.SCORE_THRESHOLD
      );
    });
  }

  async getCacheEntry(
    cache: Array<CacheEntry>,
    method: string,
    request: string
  ): Promise<CacheEntry | null> {
    const entry = cache.find(
      (entry) => entry.method === method && entry.request === request
    );

    if (!entry) {
      return null;
    }
    const entryDate = new Date(entry.ttl).getTime();
    if (entryDate <= Date.now()) {
      await this.evictFromCache(cache, method, request);
      return null;
    }

    entry.last_access_time = new Date();
    entry.hits++;

    return entry;
  }
}
