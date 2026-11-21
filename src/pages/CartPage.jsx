import usePageTitle from '../hooks/usePageTitle.js';
import { Link, useNavigate } from 'react-router-dom';
import CartLine from '../components/CartLine.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { getCartIssues } from '../utils/cartUtils.js';

export default function CartPage({ lines, avoided, onUpdateQty, onRemove, onClear }) {
  usePageTitle('Your cart');
  const navigate = useNavigate();
  const issues = getCartIssues(lines, avoided);

  if (lines.length === 0) {
    return (
      <div className="container page">
        <div className="state-box">
          <h1>Your cart is empty</h1>
          <p>Add a few dishes from today’s menu to start an order.</p>
          <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Your cart</h1>
      {issues.length > 0 && (
        <div className="notice notice-error" role="alert">
          <strong>{issues.length} item{issues.length > 1 ? 's need' : ' needs'} attention before checkout.</strong> Today’s menu or your allergen settings changed. Fix the highlighted lines below.
        </div>
      )}
      <div className="two-col">
        <ul className="cart-list">
          {lines.map((line) => (
            <CartLine
              key={line.id}
              line={line}
              issues={issues.filter((i) => i.id === line.id)}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          ))}
        </ul>
        <OrderSummary lines={lines}>
          <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/checkout')} disabled={issues.length > 0}>
            Continue to checkout
          </button>
          {issues.length > 0 && <p className="hint error-text">Resolve the issues above to continue.</p>}
          <div className="summary-secondary">
            <Link to="/menu">Add more dishes</Link>
            <button type="button" className="btn btn-link" onClick={onClear}>Empty cart</button>
          </div>
        </OrderSummary>
      </div>
    </div>
  );
}
