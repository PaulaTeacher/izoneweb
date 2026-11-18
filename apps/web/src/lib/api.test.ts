import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CatalogUnavailableError,
  getCompatibleAccessories,
  getHomeSummary,
  getProduct,
  getProducts,
} from './api';

const fetchMock = vi.fn<typeof fetch>();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const product = { id: 'p1', slug: 'iphone-18-pro', name: 'iPhone 18 Pro' };

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

/** Ejecuta la promesa avanzando los timers (reintento y timeout). */
async function run<T>(promise: Promise<T>): Promise<T> {
  const settled = promise.then(
    (v) => ({ ok: true as const, v }),
    (e: unknown) => ({ ok: false as const, e }),
  );
  await vi.runAllTimersAsync();
  const r = await settled;
  if (r.ok) return r.v;
  throw r.e;
}

describe('getProduct en producción', () => {
  beforeEach(() => vi.stubEnv('NODE_ENV', 'production'));

  it('devuelve el producto cuando la API responde 200', async () => {
    fetchMock.mockResolvedValueOnce(json(product));
    await expect(run(getProduct('iphone-18-pro'))).resolves.toEqual(product);
  });

  it('devuelve null (→ notFound) solo cuando la API responde 404', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'Not Found' }, 404));
    await expect(run(getProduct('no-existe'))).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('lanza CatalogUnavailableError si la API no responde, tras un reintento', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    await expect(run(getProduct('iphone-18-pro'))).rejects.toBeInstanceOf(
      CatalogUnavailableError,
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('lanza si la API responde 5xx dos veces', async () => {
    fetchMock.mockResolvedValue(json({}, 503));
    await expect(run(getProduct('iphone-18-pro'))).rejects.toBeInstanceOf(
      CatalogUnavailableError,
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('recupera con el reintento si el primer intento falla (arranque en frío)', async () => {
    fetchMock
      .mockRejectedValueOnce(new DOMException('aborted', 'AbortError'))
      .mockResolvedValueOnce(json(product));
    await expect(run(getProduct('iphone-18-pro'))).resolves.toEqual(product);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('aborta la petición al superar el timeout y reintenta', async () => {
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          );
        }),
    );
    await expect(run(getProduct('iphone-18-pro'))).rejects.toBeInstanceOf(
      CatalogUnavailableError,
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('nunca devuelve productos mock', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    await expect(run(getProduct('iphone-17-pro'))).rejects.toThrow();
  });
});

describe('listas del catálogo en producción', () => {
  beforeEach(() => vi.stubEnv('NODE_ENV', 'production'));

  it('getProducts lanza (no devuelve lista vacía ni mocks) si la API está caída', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    await expect(run(getProducts({ category: 'iphone' }))).rejects.toBeInstanceOf(
      CatalogUnavailableError,
    );
  });

  it('getProducts devuelve la lista de la API', async () => {
    fetchMock.mockResolvedValueOnce(json([product]));
    await expect(run(getProducts({ category: 'iphone' }))).resolves.toEqual([product]);
  });

  it('getHomeSummary lanza si la API está caída', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    await expect(run(getHomeSummary())).rejects.toBeInstanceOf(CatalogUnavailableError);
  });

  it('getCompatibleAccessories no rompe la ficha: devuelve []', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    await expect(run(getCompatibleAccessories('iphone-18-pro'))).resolves.toEqual([]);
  });
});

describe('desarrollo local sin API', () => {
  beforeEach(() => vi.stubEnv('NODE_ENV', 'development'));

  it('getProducts usa los mocks', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    const products = await run(getProducts());
    expect(products.length).toBeGreaterThan(0);
  });

  it('un 404 real sigue siendo null aunque haya mocks', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'Not Found' }, 404));
    await expect(run(getProduct('iphone-17-pro'))).resolves.toBeNull();
  });
});
