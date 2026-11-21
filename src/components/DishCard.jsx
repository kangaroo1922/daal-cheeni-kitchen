import { useState } from 'react';
import { Link } from 'react-router-dom';
import DishImage from './DishImage.jsx';
import StockBadge from './StockBadge.jsx';
import { ALLERGENS } from '../data/menu.js';
import { getAllergenConflicts } from '../rules/orderRules.js';
import { formatPrice, spiceLabel } from '../utils/format.js';

// Card shows everything needed to compare dishes without opening each one:
// price, availability, diet, spice, prep time and allergens.
export default function DishCard({ dish, avoided, inCartQty, onAdd, linkSearch = '' }) {
  const [feedback, setFeedback] = useState(null);
  const conflicts = getAllergenConflicts(dish, avoided);
  const soldOut = dish.stock <= 0;

  function handleAdd() {
    const result = onAdd(dish, 1);
    setFeedback(result.ok ? { ok: true, text: `Added. ${inCartQty + 1} in cart.` } : { ok: false, text: result.message });
  }

  return (
    <article className={`dish-card ${soldOut ? 'is-unavailable' : ''}`}>
      <DishImage src={dish.image} name={dish.name} />
      <div className="dish-card-body">
        <div className="card-topline">
          <p className="eyebrow">{dish.category}</p>
          <StockBadge stock={dish.stock} />
        </div>
        <h3 className="dish-title">
          <Link to={`/menu/${dish.id}${linkSearch}`}>{dish.name}</Link>
        </h3>
        <p className="price">{formatPrice(dish.price)}</p>
        <ul className="meta-list" aria-label="Dish facts">
          <li>{dish.vegetarian ? '🌱 Vegetarian' : '🍗 Non-veg'}</li>
          <li>🌶 {spiceLabel(dish.spiceLevel)}</li>
          <li>⏱ {dish.prepMinutes} min</li>
        </ul>
        <p className="allergen-line">
          <strong>Contains:</strong>{' '}
          {dish.allergens.length ? dish.allergens.map((a) => ALLERGENS[a]).join(', ') : 'No listed allergens'}
        </p>
        {conflicts.length > 0 && (
          <p className="tag tag-danger block">⚠ Not suitable: contains {conflicts.map((a) => ALLERGENS[a]).join(', ')}</p>
        )}
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={soldOut || conflicts.length > 0}
          >
            {soldOut ? 'Sold out' : conflicts.length ? 'Unavailable for you' : 'Add to cart'}
          </button>
          {inCartQty > 0 && <span className="in-cart">✓ {inCartQty} in cart</span>}
        </div>
        <p className={`feedback ${feedback?.ok === false ? 'is-error' : ''}`} aria-live="polite">
          {feedback?.text}
        </p>
      </div>
    </article>
  );
}
