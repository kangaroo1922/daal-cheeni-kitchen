import { MENU_ITEMS } from '../data/menu.js';

// Simulates a network request for today's menu.
// Returns a Promise so components must handle loading and failure.
export function fetchMenu(delay = 700) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return copies so no component can mutate the source data.
      resolve(MENU_ITEMS.map((item) => ({ ...item })));
    }, delay);
  });
}
