import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import DishImage from '../components/DishImage.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import StockBadge from '../components/StockBadge.jsx';
import { ALLERGENS } from '../data/menu.js';
import { MAX_PER_DISH, checkQuantity, getAllergenConflicts, getMaxQuantity } from '../rules/orderRules.js';
import { formatPrice, spiceLabel } from '../utils/format.js';

export default function DishDetailsPage({ menu, cart, avoided, onAdd }) {
  const { id } = useParams();
  const location = useLocation();
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState(null);

  // The menu link keeps the user's search/filters (passed as ?query) so "Back to menu" restores them.
  const backTo = `/menu${location.search}`;
  const dish = menu.find((d) => d.id === id);

  if (!dish) {
    const suggestions = menu.filter((d) => d.stock > 0).slice(0, 3);
    return (
      <div className="container page">
        <div className="state-box">
          <h1>Dish not found</h1>
          <p>There is no dish with the ID “{id}”. It may have been removed or the link is mistyped.</p>
          <Link className="btn btn-primary" to="/menu">Browse the full menu</Link>
        </div>
        {suggestions.length > 0 && (
          <section className="suggestions">
            <h2>Available today</h2>
            <ul>{suggestions.map((d) => <li key={d.id}><Link to={`/menu/${d.id}`}>{d.name}</Link> – {formatPrice(d.price)}</li>)}</ul>
          </section>
        )}
      </div>
    );
  }

  const inCart = cart.find((l) => l.id === dish.id)?.qty ?? 0;
  const max = getMaxQuantity(dish);
  const conflicts = getAllergenConflicts(dish, avoided);
  // Check the quantity the user wants PLUS what is already in the cart.
  const qtyCheck =
    Number.isInteger(qty) && qty >= 1
      ? checkQuantity(dish, qty + inCart)
      : { ok: false, message: 'Quantity must be at least 1.' };
  const canAdd = dish.stock > 0 && conflicts.length === 0 && qtyCheck.ok;

  function handleAdd() {
    const result = onAdd(dish, qty);
    setFeedback(result.ok ? { ok: true, text: `Added ${qty} × ${dish.name}.` } : { ok: false, text: result.message });
    if (result.ok) setQty(1);
  }

  return (
    <div className="container page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to={backTo}>← Back to menu</Link>
      </nav>
      <div className="details">
        <DishImage src={dish.image} name={dish.name} className="details-image" />
        <div className="details-body">
          <p className="eyebrow">{dish.category}</p>
          <h1>{dish.name}</h1>
          <p className="price price-lg">{formatPrice(dish.price)}</p>
          <StockBadge stock={dish.stock} />
          <p className="description">{dish.description}</p>

          <dl className="facts">
            <div><dt>Diet</dt><dd>{dish.vegetarian ? 'Vegetarian' : 'Contains meat'}</dd></div>
            <div><dt>Spice</dt><dd>{spiceLabel(dish.spiceLevel)}</dd></div>
            <div><dt>Prep time</dt><dd>{dish.prepMinutes} min</dd></div>
            <div><dt>Allergens</dt><dd>{dish.allergens.length ? dish.allergens.map((a) => ALLERGENS[a]).join(', ') : 'None listed'}</dd></div>
            <div><dt>Left today</dt><dd>{dish.stock > 0 ? `${dish.stock} portions` : 'Sold out'}</dd></div>
          </dl>

          {conflicts.length > 0 && (
            <p className="notice notice-error">⚠ Contains {conflicts.map((a) => ALLERGENS[a]).join(', ')}, which you’ve chosen to avoid. Change your allergen settings on the menu page to order it.</p>
          )}

          {dish.stock > 0 && conflicts.length === 0 && (
            <div className="add-panel card">
              <QuantityControl id="detail-qty" value={qty} max={Math.max(1, max - inCart)} onChange={setQty} />
              <p className="hint">Limit: {MAX_PER_DISH} per dish per order, and no more than today’s stock.{inCart > 0 && ` You already have ${inCart} in your cart.`}</p>
              {!qtyCheck.ok && <p className="error-text" role="alert">{qtyCheck.message}</p>}
              <button type="button" className="btn btn-primary btn-lg" onClick={handleAdd} disabled={!canAdd}>
                Add {qty > 0 ? qty : ''} to cart · {formatPrice(dish.price * Math.max(qty, 0))}
              </button>
              <p className={`feedback ${feedback?.ok === false ? 'is-error' : ''}`} aria-live="polite">
                {feedback?.text} {feedback?.ok && <Link to="/cart">View cart</Link>}
              </p>
            </div>
          )}
          {dish.stock <= 0 && (
            <p className="notice">This dish is sold out today. <Link to={`/menu?cat=${encodeURIComponent(dish.category)}&avail=1`}>See other {dish.category} dishes</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
