type CacheEntry<T> = { value: T; expiresAt: number };

/** Process-local TTL cache for hot catalog reads. */
export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (Date.now() > hit.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): T {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  }

  async getOrSet<T>(key: string, ttlMs: number, factory: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;
    const value = await factory();
    return this.set(key, value, ttlMs);
  }

  clear() {
    this.store.clear();
  }
}

export const catalogCache = new MemoryCache();
