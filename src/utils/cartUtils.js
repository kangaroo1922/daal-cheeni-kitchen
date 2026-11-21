import { checkQuantity, getAllergenConflicts } from '../rules/orderRules.js';
import { ALLERGENS } from '../data/menu.js';

// Joins saved cart entries ({ id, qty }) with the current menu data.
export function buildCartLines(cart, menu) {
  return cart.map(({ id, qty }) => {
    const dish = menu.find((d) => d.id === id) ?? null;
    return { id, qty, dish, lineTotal: dish ? dish.price * qty : 0 };
  });
}

export function getSubtotal(lines) {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

export function getItemCount(cart) {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

// Checks every cart line against today's data and the customer's allergen choices.
// Returns a list of problems; each one says how it can be fixed.
export function getCartIssues(lines, avoided) {
  const issues = [];
  for (const { id, qty, dish } of lines) {
    if (!dish) {
      issues.push({ id, type: 'missing', message: 'This dish is no longer on today’s menu.', fix: 'remove' });
      continue;
    }
    const qtyCheck = checkQuantity(dish, qty);
    if (!qtyCheck.ok) {
      issues.push({
        id,
        type: dish.stock <= 0 ? 'soldout' : 'quantity',
        message: qtyCheck.message,
        fix: qtyCheck.max > 0 ? 'reduce' : 'remove',
        maxQty: qtyCheck.max,
      });
    }
    const conflicts = getAllergenConflicts(dish, avoided);
    if (conflicts.length > 0) {
      issues.push({
        id,
        type: 'allergen',
        message: `Contains ${conflicts.map((a) => ALLERGENS[a]).join(' and ')}, which you avoid.`,
        fix: 'remove',
      });
    }
  }
  return issues;
}
