import usePageTitle from '../hooks/usePageTitle.js';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary.jsx';
import { DELIVERY_SECTORS, MIN_DELIVERY_ORDER, checkFulfilment, getDeliveryFee } from '../rules/orderRules.js';
import { getCartIssues, getSubtotal } from '../utils/cartUtils.js';
import { NOTES_LIMIT, PICKUP_SLOTS, validateCheckout } from '../utils/validateCheckout.js';
import { formatPrice } from '../utils/format.js';

const EMPTY_FORM = { name: '', phone: '', method: 'delivery', sector: '', address: '', pickupSlot: '', notes: '' };

export default function CheckoutPage({ lines, avoided, onPlaceOrder }) {
  usePageTitle('Checkout');
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const errors = validateCheckout(form);
  const issues = getCartIssues(lines, avoided);
  const subtotal = getSubtotal(lines);
  const fulfilment = checkFulfilment({ subtotal, method: form.method, sector: form.sector });

  if (lines.length === 0) {
    return (
      <div className="container page">
        <div className="state-box">
          <h1>Nothing to check out</h1>
          <p>Your cart is empty. Add dishes first, then come back here.</p>
          <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
        </div>
      </div>
    );
  }

  // One handler for every field: copy the old object and change one property (no mutation).
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }
  // Show a field's error after the user leaves it, or after they try to submit.
  const showError = (field) => (touched[field] || submitted) && errors[field];

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      // Move keyboard focus to the first invalid field.
      const first = Object.keys(errors)[0];
      formRef.current?.elements[first]?.focus();
      return;
    }
    if (issues.length > 0 || !fulfilment.ok) return;

    const deliveryFee = getDeliveryFee(subtotal, form.method);
    // Only non-sensitive data is kept: first name, items and totals (no phone or address).
    const order = {
      id: `DC-${Date.now().toString(36).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      firstName: form.name.trim().split(' ')[0],
      method: form.method,
      where: form.method === 'delivery' ? form.sector : `Pickup ${form.pickupSlot}`,
      items: lines.map(({ dish, qty, lineTotal }) => ({ id: dish.id, name: dish.name, qty, lineTotal })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      readyIn: Math.max(...lines.map((l) => l.dish.prepMinutes)) + (form.method === 'delivery' ? 25 : 0),
    };
    onPlaceOrder(order);
    navigate('/order/confirmed', { replace: true, state: { order } });
  }

  const blocked = issues.length > 0 || !fulfilment.ok;

  return (
    <div className="container page">
      <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/cart">← Back to cart</Link></nav>
      <h1>Checkout</h1>
      <p className="notice">🧪 Simulated order: nothing is cooked or charged. Payment is cash on delivery/pickup.</p>

      <div className="two-col">
        <form ref={formRef} className="card checkout-form" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Your details</legend>
            <Field id="name" label="Full name" error={showError('name')}>
              <input id="name" name="name" autoComplete="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
                aria-invalid={Boolean(showError('name'))} aria-describedby="name-error" />
            </Field>
            <Field id="phone" label="Mobile number" hint="Format: 03XX XXXXXXX" error={showError('phone')}>
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur}
                aria-invalid={Boolean(showError('phone'))} aria-describedby="phone-hint phone-error" />
            </Field>
          </fieldset>

          <fieldset>
            <legend>Delivery or pickup</legend>
            <div className="radio-cards">
              <label className={`radio-card ${form.method === 'delivery' ? 'is-selected' : ''}`}>
                <input type="radio" name="method" value="delivery" checked={form.method === 'delivery'} onChange={handleChange} />
                <span><strong>Delivery</strong><br /><small>Min. {formatPrice(MIN_DELIVERY_ORDER)} · selected sectors</small></span>
              </label>
              <label className={`radio-card ${form.method === 'pickup' ? 'is-selected' : ''}`}>
                <input type="radio" name="method" value="pickup" checked={form.method === 'pickup'} onChange={handleChange} />
                <span><strong>Pickup</strong><br /><small>H-11 Markaz · no minimum</small></span>
              </label>
            </div>

            {form.method === 'delivery' ? (
              <>
                <Field id="sector" label="Sector" hint={`We deliver to ${DELIVERY_SECTORS.join(', ')}.`} error={showError('sector')}>
                  <select id="sector" name="sector" value={form.sector} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={Boolean(showError('sector'))} aria-describedby="sector-hint sector-error">
                    <option value="">Choose a sector…</option>
                    {DELIVERY_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                    <option value="other">My area isn’t listed</option>
                  </select>
                </Field>
                <Field id="address" label="Hostel / house and street" error={showError('address')}>
                  <textarea id="address" name="address" rows="2" autoComplete="street-address" value={form.address} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={Boolean(showError('address'))} aria-describedby="address-error" />
                </Field>
              </>
            ) : (
              <Field id="pickupSlot" label="Pickup time (today)" error={showError('pickupSlot')}>
                <select id="pickupSlot" name="pickupSlot" value={form.pickupSlot} onChange={handleChange} onBlur={handleBlur}
                  aria-invalid={Boolean(showError('pickupSlot'))} aria-describedby="pickupSlot-error">
                  <option value="">Choose a time…</option>
                  {PICKUP_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            )}
          </fieldset>

          <Field id="notes" label="Notes for the kitchen (optional)" hint={`${form.notes.length}/${NOTES_LIMIT} characters`} error={showError('notes')}>
            <textarea id="notes" name="notes" rows="2" value={form.notes} onChange={handleChange} onBlur={handleBlur}
              aria-invalid={Boolean(showError('notes'))} aria-describedby="notes-hint notes-error" />
          </Field>

          {!fulfilment.ok && <p className="notice notice-error" role="alert">{fulfilment.message}</p>}
          {issues.length > 0 && (
            <p className="notice notice-error" role="alert">Some cart items need attention. <Link to="/cart">Fix them in your cart</Link>.</p>
          )}
          {submitted && Object.keys(errors).length > 0 && (
            <p className="error-text" role="alert">Please correct the {Object.keys(errors).length} highlighted field(s). Your other answers are kept.</p>
          )}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={blocked}>
            Place simulated order
          </button>
        </form>

        <OrderSummary lines={lines} method={form.method} sector={form.sector}>
          <ul className="summary-items">
            {lines.map((l) => <li key={l.id}><span>{l.qty} × {l.dish?.name ?? l.id}</span><span>{formatPrice(l.lineTotal)}</span></li>)}
          </ul>
        </OrderSummary>
      </div>
    </div>
  );
}

// Label + input + hint + error, wired together with ids for screen readers.
function Field({ id, label, hint, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p id={`${id}-hint`} className="hint">{hint}</p>}
      <p id={`${id}-error`} className="error-text" aria-live="polite">{error || ''}</p>
    </div>
  );
}
