import { CacheEntry } from "../utils/types/CacheEntry";

export default class CachingLogic {
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
    const age = Date.now() - entry.creation_time.getTime();
    const staleness = Date.now() - entry.last_access_time.getTime();
    const weight1 = 0.7;
    const weight2 = 0.3;

    return staleness * weight1 + (1 / (entry.hits + 1)) * weight2;
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
    cache: Array<CacheEntry>,
    method: string,
    request: string,
    res: any,
    contentType: string
  ): Promise<Array<CacheEntry>> {
    const newEntry: CacheEntry = {
      method,
      request,
      res,
      hits: 1,
      creation_time: new Date(),
      last_access_time: new Date(),
      ttl: new Date(Date.now() + this.determineTTL(contentType, method)),
    };

    const existingIndex = cache.findIndex(
      (entry) => entry.method === method && entry.request === request
    );

    if (existingIndex !== -1) {
      cache[existingIndex] = {
        ...newEntry,
        hits: cache[existingIndex].hits + 1,
      };
      return cache;
    }

    if (cache.length >= this.MAX_CACHE_SIZE) {
      await this.batchEvict(cache);
      if (cache.length >= this.MAX_CACHE_SIZE) {
        let worstScore = -1;
        let worstIndex = -1;

        cache.forEach((entry, index) => {
          const score = this.calculateScore(entry);
          if (score > worstScore) {
            worstScore = score;
            worstIndex = index;
          }
        });

        if (worstIndex !== -1) {
          cache.splice(worstIndex, 1);
        }
      }
    }

    cache.push(newEntry);
    return cache;
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
      // Keep entry if ALL conditions are met
      return (
        entry.ttl.getTime() > now &&
        now - entry.last_access_time.getTime() <= this.STALENESS_THRESHOLD &&
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

    if (entry.ttl.getTime() <= Date.now()) {
      await this.evictFromCache(cache, method, request);
      return null;
    }

    entry.last_access_time = new Date();
    entry.hits++;

    return entry;
  }
}
