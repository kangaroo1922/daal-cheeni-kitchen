import { MENU_ITEMS } from '../data/menu.js';
import { DEFAULT_DEMO, loadJSON, saveJSON, STORAGE_KEYS } from '../utils/storage.js';

// Simulated "today's availability change" used by the demo control:
// biryani runs low, palak paneer sells out, and kheer is taken off the menu.
function applyAvailabilityChange(items) {
  return items
    .filter((item) => item.id !== 'kheer')
    .map((item) => {
      if (item.id === 'chicken-biryani') return { ...item, stock: 2 };
      if (item.id === 'palak-paneer') return { ...item, stock: 0 };
      return item;
    });
}

// Simulates a network request for today's menu.
// Returns a Promise so components must handle loading, failure and retry.
export function fetchMenu(delay = 700) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const demo = { ...DEFAULT_DEMO, ...loadJSON(STORAGE_KEYS.demo, {}) };

      if (demo.failNextLoad) {
        // Keeps failing until clearSimulatedFailure() runs (the Retry button calls it).
        reject(new Error('The kitchen server did not respond (simulated network failure).'));
        return;
      }
      if (demo.emptyMenu) {
        resolve([]);
        return;
      }
      // Copies, so no component can mutate the source data.
      const items = MENU_ITEMS.map((item) => ({ ...item }));
      resolve(demo.changedAvailability ? applyAvailabilityChange(items) : items);
    }, delay);
  });
}

// Called by Retry: the simulated "server problem" is over, so the next load succeeds.
export function clearSimulatedFailure() {
  const demo = { ...DEFAULT_DEMO, ...loadJSON(STORAGE_KEYS.demo, {}) };
  saveJSON(STORAGE_KEYS.demo, { ...demo, failNextLoad: false });
}
