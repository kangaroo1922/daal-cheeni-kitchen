import { DELIVERY_FEE, FREE_DELIVERY_FROM, MIN_DELIVERY_ORDER, checkFulfilment, getDeliveryFee } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

// All values are derived from props on every render – nothing here is stored in state.
export default function OrderSummary({ lines, method = 'delivery', sector = '', children }) {
  const validLines = lines.filter((l) => l.dish);
  const itemCount = validLines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = validLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryFee = getDeliveryFee(subtotal, method);
  const total = subtotal + deliveryFee;
  const longestPrep = Math.max(0, ...validLines.map((l) => l.dish.prepMinutes));
  const readyIn = longestPrep + (method === 'delivery' ? 25 : 0);
  const fulfilment = checkFulfilment({ subtotal, method, sector });
  const progress = Math.min(100, Math.round((subtotal / MIN_DELIVERY_ORDER) * 100));

  return (
    <aside className="summary card" aria-labelledby="summary-title">
      <h2 id="summary-title">Order summary</h2>
      <dl className="summary-rows">
        <div><dt>Items</dt><dd>{itemCount}</dd></div>
        <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div>
          <dt>{method === 'delivery' ? 'Delivery fee' : 'Pickup (H-11 Markaz)'}</dt>
          <dd>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</dd>
        </div>
        <div className="summary-total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
        {itemCount > 0 && <div><dt>Estimated time</dt><dd>~{readyIn} min</dd></div>}
      </dl>

      {method === 'delivery' && (
        <div className="min-order">
          <div className="progress" role="progressbar" aria-label="Progress to delivery minimum" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
          {fulfilment.shortBy > 0 ? (
            <p className="hint warning-text">Add {formatPrice(fulfilment.shortBy)} more to reach the {formatPrice(MIN_DELIVERY_ORDER)} delivery minimum.</p>
          ) : !fulfilment.ok ? (
            <p className="hint error-text">{fulfilment.message}</p>
          ) : (
            <p className="hint success-text">✓ Delivery minimum reached.</p>
          )}
          <p className="hint">Delivery {formatPrice(DELIVERY_FEE)} · free from {formatPrice(FREE_DELIVERY_FROM)}</p>
        </div>
      )}
      {children}
    </aside>
  );
}
