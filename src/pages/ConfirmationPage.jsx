import { Link, useLocation } from 'react-router-dom';
import { loadJSON, STORAGE_KEYS } from '../utils/storage.js';
import { formatPrice } from '../utils/format.js';

export default function ConfirmationPage() {
  const location = useLocation();
  // Prefer the order passed during navigation; fall back to the saved copy after a refresh.
  const order = location.state?.order ?? loadJSON(STORAGE_KEYS.lastOrder, null);

  if (!order) {
    return (
      <div className="container page">
        <div className="state-box">
          <h1>No recent order</h1>
          <p>We couldn’t find an order on this device.</p>
          <Link className="btn btn-primary" to="/menu">Start an order</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page narrow">
      <div className="confirmation card" role="status">
        <p className="success-icon" aria-hidden="true">✓</p>
        <h1>Order received, {order.firstName}!</h1>
        <p className="lead">Order <strong>{order.id}</strong> · {order.method === 'delivery' ? `Delivery to ${order.where}` : order.where}</p>
        <p>Estimated {order.method === 'delivery' ? 'arrival' : 'ready'} in about <strong>{order.readyIn} minutes</strong>. Pay {formatPrice(order.total)} in cash.</p>
        <table className="order-table">
          <caption className="sr-only">Items in order {order.id}</caption>
          <thead><tr><th scope="col">Dish</th><th scope="col">Qty</th><th scope="col">Amount</th></tr></thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}><td>{item.name}</td><td>{item.qty}</td><td>{formatPrice(item.lineTotal)}</td></tr>
            ))}
          </tbody>
          <tfoot>
            <tr><th scope="row" colSpan="2">Subtotal</th><td>{formatPrice(order.subtotal)}</td></tr>
            <tr><th scope="row" colSpan="2">Delivery</th><td>{order.deliveryFee ? formatPrice(order.deliveryFee) : 'Free'}</td></tr>
            <tr><th scope="row" colSpan="2">Total</th><td><strong>{formatPrice(order.total)}</strong></td></tr>
          </tfoot>
        </table>
        <p className="notice">🧪 This was a simulated order for a student project. No food will arrive.</p>
        <Link className="btn btn-primary" to="/menu">Back to the menu</Link>
      </div>
    </div>
  );
}
