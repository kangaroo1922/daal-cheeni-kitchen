// Automated test for Rule 3 (minimum order for delivery).
// Run with:  npm test   (which runs: node --test tests/orderRules.test.js)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkFulfilment, MIN_DELIVERY_ORDER, getDeliveryFee } from '../src/rules/orderRules.js';

test('valid: delivery order of Rs 1200 to H-11 is accepted', () => {
  const result = checkFulfilment({ subtotal: 1200, method: 'delivery', sector: 'H-11' });
  assert.equal(result.ok, true);
  assert.equal(result.shortBy, 0);
});

test('boundary: delivery order of exactly Rs 800 is accepted', () => {
  assert.equal(MIN_DELIVERY_ORDER, 800);
  const result = checkFulfilment({ subtotal: 800, method: 'delivery', sector: 'G-10' });
  assert.equal(result.ok, true);
});

test('breaks rule: delivery order of Rs 799 is rejected and is Rs 1 short', () => {
  const result = checkFulfilment({ subtotal: 799, method: 'delivery', sector: 'G-10' });
  assert.equal(result.ok, false);
  assert.equal(result.shortBy, 1);
  assert.match(result.message, /minimum order of Rs 800/);
});

test('pickup has no minimum: Rs 120 pickup order is accepted', () => {
  const result = checkFulfilment({ subtotal: 120, method: 'pickup' });
  assert.equal(result.ok, true);
});

test('area outside the delivery sectors is rejected even above the minimum', () => {
  const result = checkFulfilment({ subtotal: 1500, method: 'delivery', sector: 'other' });
  assert.equal(result.ok, false);
});

test('delivery fee is Rs 150 below Rs 2000 and free at exactly Rs 2000', () => {
  assert.equal(getDeliveryFee(1999, 'delivery'), 150);
  assert.equal(getDeliveryFee(2000, 'delivery'), 0);
  assert.equal(getDeliveryFee(500, 'pickup'), 0);
});
