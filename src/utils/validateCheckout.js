import { DELIVERY_SECTORS } from '../rules/orderRules.js';

export const PICKUP_SLOTS = ['12:30 – 13:00', '13:00 – 13:30', '18:30 – 19:00', '19:00 – 19:30', '20:00 – 20:30'];
export const NOTES_LIMIT = 200;

// Returns an object of field -> error message. Empty object = valid.
export function validateCheckout(form) {
  const errors = {};
  const name = form.name.trim();
  const phone = form.phone.replace(/[\s-]/g, '');

  if (!name) errors.name = 'Enter your name so the rider can find you.';
  else if (!/^[A-Za-z][A-Za-z .'-]{1,39}$/.test(name)) errors.name = 'Use 2–40 letters (spaces, dots and hyphens are fine).';

  if (!phone) errors.phone = 'Enter a mobile number for order updates.';
  else if (!/^03\d{9}$/.test(phone)) errors.phone = 'Use an 11-digit Pakistani mobile number starting with 03, e.g. 0312 3456789.';

  if (form.method === 'delivery') {
    if (!form.sector) errors.sector = 'Choose your sector.';
    else if (form.sector !== 'other' && !DELIVERY_SECTORS.includes(form.sector)) errors.sector = 'Choose a sector from the list.';
    if (form.address.trim().length < 10) errors.address = 'Add your hostel or house and street (at least 10 characters).';
  } else if (!PICKUP_SLOTS.includes(form.pickupSlot)) {
    errors.pickupSlot = 'Choose a pickup time.';
  }

  if (form.notes.length > NOTES_LIMIT) errors.notes = `Notes can be at most ${NOTES_LIMIT} characters.`;
  return errors;
}
