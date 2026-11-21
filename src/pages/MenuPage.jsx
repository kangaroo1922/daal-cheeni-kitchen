import usePageTitle from '../hooks/usePageTitle.js';
import { useSearchParams } from 'react-router-dom';
import DishCard from '../components/DishCard.jsx';
import AllergenPreferences from '../components/AllergenPreferences.jsx';
import MenuFilters, { SORT_OPTIONS } from '../components/MenuFilters.jsx';
import { getAllergenConflicts } from '../rules/orderRules.js';

// Filters live in the URL (?q=&cat=&sort=...) instead of component state, so opening a dish
// and pressing Back – or refreshing, or sharing the link – keeps the customer's place.
function readFilters(params) {
  const sort = params.get('sort');
  return {
    q: params.get('q') ?? '',
    cat: params.get('cat') ?? '',
    sort: sort in SORT_OPTIONS ? sort : 'featured',
    veg: params.get('veg') === '1',
    avail: params.get('avail') === '1',
    safe: params.get('safe') === '1',
  };
}

const sorters = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  fastest: (a, b) => a.prepMinutes - b.prepMinutes,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function MenuPage({ menu, cart, avoided, onAvoidedChange, onAdd }) {
  usePageTitle('Menu');
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value === '' || value === false || (key === 'sort' && value === 'featured')) next.delete(key);
    else next.set(key, value === true ? '1' : value);
    // replace: typing in search shouldn't create one history entry per keystroke
    setParams(next, { replace: true });
  }
  const clearFilters = () => setParams({}, { replace: true });
  const activeCount = ['q', 'cat', 'veg', 'avail', 'safe'].filter((k) => Boolean(filters[k])).length;

  const text = filters.q.trim().toLowerCase();
  const results = menu
    .filter((d) => !text || `${d.name} ${d.description} ${d.category}`.toLowerCase().includes(text))
    .filter((d) => !filters.cat || d.category === filters.cat)
    .filter((d) => !filters.veg || d.vegetarian)
    .filter((d) => !filters.avail || d.stock > 0)
    .filter((d) => !filters.safe || getAllergenConflicts(d, avoided).length === 0)
    .sort(sorters[filters.sort]); // filter() already returned a new array, so sort() doesn't touch `menu`

  const qtyInCart = (id) => cart.find((l) => l.id === id)?.qty ?? 0;
  const search = params.toString() ? `?${params.toString()}` : '';

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Today&apos;s menu</h1>
        <p className="muted">Freshly cooked in H-11 · Max 5 portions per dish · Delivery from Rs 800</p>
      </div>

      <div className="menu-layout">
        <div className="menu-sidebar">
          <MenuFilters filters={filters} onChange={updateFilter} onClear={clearFilters} activeCount={activeCount} />
          <div className="card"><AllergenPreferences avoided={avoided} onChange={onAvoidedChange} /></div>
        </div>

        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="results-count" aria-live="polite">
            {menu.length === 0 ? 'No dishes' : `Showing ${results.length} of ${menu.length} dishes`}
          </h2>

          {menu.length === 0 ? (
            // The data itself is empty – different from "your filters matched nothing".
            <div className="state-box">
              <h3>Today’s menu hasn’t been published yet</h3>
              <p>The kitchen usually publishes the menu by 11:00 am. Please check back soon.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="state-box">
              <h3>No dishes match {filters.q ? `“${filters.q}”` : 'these filters'}</h3>
              <p>Try a different word, or remove a filter. {filters.cat && `You’re only looking at ${filters.cat}.`}</p>
              <div className="btn-row">
                {filters.q && <button type="button" className="btn btn-secondary" onClick={() => updateFilter('q', '')}>Clear search</button>}
                <button type="button" className="btn btn-primary" onClick={clearFilters}>Show all dishes</button>
              </div>
            </div>
          ) : (
            <div className="dish-grid">
              {results.map((dish) => (
                <DishCard key={dish.id} dish={dish} avoided={avoided} onAdd={onAdd} inCartQty={qtyInCart(dish.id)} linkSearch={search} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
