// Thin wrappers around localStorage. Wrapped in try/catch because storage can be
// disabled or contain corrupted JSON – the app must still start.
export const STORAGE_KEYS = {
  cart: 'dck-cart',
  allergens: 'dck-avoided-allergens',
  lastOrder: 'dck-last-order',
};

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled – nothing else to do on a frontend-only site.
  }
}
