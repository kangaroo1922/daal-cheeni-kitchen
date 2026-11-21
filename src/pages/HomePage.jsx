import { Link } from 'react-router-dom';
import { DELIVERY_FEE, DELIVERY_SECTORS, FREE_DELIVERY_FROM, MAX_PER_DISH, MIN_DELIVERY_ORDER } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow light">Home-style meals · Islamabad</p>
            <h1>Ghar jaisa khana, delivered to your hostel.</h1>
            <p className="lead">Affordable lunches and dinners cooked fresh every day in H-11 for university students nearby.</p>
            <div className="btn-row">
              <Link className="btn btn-primary btn-lg" to="/menu">Browse today&apos;s menu</Link>
              <Link className="btn btn-ghost btn-lg" to="/menu?veg=1">Vegetarian dishes</Link>
            </div>
          </div>
          <img className="hero-img" src="/images/curry.svg" alt="Illustration of a plate of curry" width="400" height="300" />
        </div>
      </section>

      <section className="container page" aria-labelledby="how-heading">
        <h2 id="how-heading">Know before you order</h2>
        <div className="info-grid">
          <article className="card">
            <h3>🛵 Delivery</h3>
            <p>{formatPrice(DELIVERY_FEE)} fee, free from {formatPrice(FREE_DELIVERY_FROM)}. Minimum order {formatPrice(MIN_DELIVERY_ORDER)}.</p>
            <p className="muted">Sectors: {DELIVERY_SECTORS.join(', ')}</p>
          </article>
          <article className="card">
            <h3>🏪 Pickup</h3>
            <p>No minimum, no fee. Collect from Shop 4, H-11 Markaz in a 30-minute slot.</p>
          </article>
          <article className="card">
            <h3>🍲 Fresh daily, limited portions</h3>
            <p>Each dish shows how many portions are left. Up to {MAX_PER_DISH} portions of one dish per order.</p>
          </article>
          <article className="card">
            <h3>⚠ Allergens up front</h3>
            <p>Every dish lists nuts, dairy, gluten and egg. Set what you avoid once and we’ll flag unsuitable dishes.</p>
          </article>
        </div>
      </section>
    </>
  );
}
