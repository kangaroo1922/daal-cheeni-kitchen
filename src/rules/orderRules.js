// Business rules for Daal Cheeni Kitchen.
// Pure functions (no React) so the app AND the Node tests use exactly the same logic.

// ---------- Rule 1: Availability / capacity ----------
// A customer may order 1 to MAX_PER_DISH portions of one dish,
// and never more than the portions left today (dish.stock).
export const MAX_PER_DISH = 5;

export function getMaxQuantity(dish) {
  return Math.max(0, Math.min(dish.stock, MAX_PER_DISH));
}

export function checkQuantity(dish, quantity) {
  const max = getMaxQuantity(dish);
  if (dish.stock <= 0) {
    return { ok: false, max, message: `${dish.name} is sold out today.` };
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, max, message: 'Quantity must be at least 1.' };
  }
  if (quantity > max) {
    const message =
      dish.stock < MAX_PER_DISH
        ? `Only ${dish.stock} portion${dish.stock === 1 ? '' : 's'} of ${dish.name} left today.`
        : `You can order up to ${MAX_PER_DISH} portions of one dish per order.`;
    return { ok: false, max, message };
  }
  return { ok: true, max, message: '' };
}

// ---------- Rule 2: Eligibility / compatibility ----------
// Dishes containing an allergen the customer avoids cannot be added,
// and existing cart lines that conflict block checkout.
export function getAllergenConflicts(dish, avoidedAllergens) {
  return dish.allergens.filter((allergen) => avoidedAllergens.includes(allergen));
}

// ---------- Rule 3: Pricing / fulfilment ----------
// Delivery only to listed sectors, minimum order Rs 800 (subtotal, before fees).
// Delivery fee Rs 150, free from Rs 2,000. Pickup has no minimum and no fee.
export const MIN_DELIVERY_ORDER = 800;
export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_FROM = 2000;
export const DELIVERY_SECTORS = ['G-9', 'G-10', 'G-11', 'H-8', 'H-9', 'H-10', 'H-11', 'H-12', 'I-8'];

export function getDeliveryFee(subtotal, method) {
  if (method !== 'delivery') return 0;
  return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}

// Returns { ok, shortBy, message }. `shortBy` = how much more the customer must add.
export function checkFulfilment({ subtotal, method, sector = '' }) {
  if (method === 'pickup') {
    return { ok: true, shortBy: 0, message: '' };
  }
  if (sector && !DELIVERY_SECTORS.includes(sector)) {
    return {
      ok: false,
      shortBy: 0,
      message: 'We don’t deliver to that area yet. Choose pickup from H-11 Markaz instead.',
    };
  }
  if (subtotal < MIN_DELIVERY_ORDER) {
    const shortBy = MIN_DELIVERY_ORDER - subtotal;
    return {
      ok: false,
      shortBy,
      message: `Delivery needs a minimum order of Rs ${MIN_DELIVERY_ORDER}. Add Rs ${shortBy} more or choose pickup.`,
    };
  }
  return { ok: true, shortBy: 0, message: '' };
}
