import { Link, useLocation } from 'react-router-dom';
import { checkFulfilment } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

// Sticky bar on small screens: keeps the running total and delivery-minimum status visible
// while browsing, so charges aren't a surprise at checkout. Hidden on wide screens via CSS.
export default function MobileCartBar({ itemCount, subtotal }) {
  const { pathname } = useLocation();
  if (itemCount === 0 || pathname === '/cart' || pathname === '/checkout') return null;
  const { shortBy } = checkFulfilment({ subtotal, method: 'delivery' });

  return (
    <div className="mobile-cart-bar">
      <div>
        <strong>{itemCount} item{itemCount > 1 ? 's' : ''} · {formatPrice(subtotal)}</strong>
        <small>{shortBy > 0 ? `Add ${formatPrice(shortBy)} for delivery` : '✓ Delivery minimum reached'}</small>
      </div>
      <Link className="btn btn-primary" to="/cart">View cart</Link>
    </div>
  );
}
