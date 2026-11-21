import { Link } from 'react-router-dom';
import QuantityControl from './QuantityControl.jsx';
import DishImage from './DishImage.jsx';
import { getMaxQuantity } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

export default function CartLine({ line, issues, onUpdateQty, onRemove }) {
  const { id, qty, dish } = line;
  const hasIssue = issues.length > 0;

  return (
    <li className={`cart-line ${hasIssue ? 'has-issue' : ''}`}>
      {dish ? <DishImage src={dish.image} name={dish.name} className="thumb" /> : <div className="thumb dish-image fallback" aria-hidden="true">?</div>}
      <div className="cart-line-main">
        <h3>{dish ? <Link to={`/menu/${id}`}>{dish.name}</Link> : `Unknown dish (${id})`}</h3>
        {dish && <p className="muted">{formatPrice(dish.price)} each</p>}
        {issues.map((issue) => (
          <div key={issue.type} className="issue" role="alert">
            <p>⚠ {issue.message}</p>
            {issue.fix === 'reduce' && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onUpdateQty(id, issue.maxQty)}>
                Change to {issue.maxQty}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="cart-line-side">
        {dish && dish.stock > 0 && (
          <QuantityControl
            id={`qty-${id}`}
            value={qty}
            max={Math.max(getMaxQuantity(dish), qty)}
            onChange={(next) => onUpdateQty(id, next)}
          />
        )}
        <p className="line-total">{formatPrice(line.lineTotal)}</p>
        <button type="button" className="btn btn-link" onClick={() => onRemove(id)}>
          Remove<span className="sr-only"> {dish?.name ?? id}</span>
        </button>
      </div>
    </li>
  );
}
