import { CATEGORIES } from '../data/menu.js';

export const SORT_OPTIONS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  fastest: 'Fastest to prepare',
  name: 'Name A–Z',
};

// Purely presentational: values come in as props, changes go out through onChange(key, value).
export default function MenuFilters({ filters, onChange, onClear, activeCount }) {
  return (
    <form className="filters card" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field search-field">
        <label htmlFor="search">Search dishes</label>
        <input id="search" type="search" placeholder="e.g. biryani, paneer, chai" value={filters.q}
          onChange={(e) => onChange('q', e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" value={filters.cat} onChange={(e) => onChange('cat', e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
          {Object.entries(SORT_OPTIONS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="toggle-group">
        <label><input type="checkbox" checked={filters.veg} onChange={(e) => onChange('veg', e.target.checked)} /> Vegetarian only</label>
        <label><input type="checkbox" checked={filters.avail} onChange={(e) => onChange('avail', e.target.checked)} /> Available now</label>
        <label><input type="checkbox" checked={filters.safe} onChange={(e) => onChange('safe', e.target.checked)} /> Hide dishes with my allergens</label>
      </div>
      {activeCount > 0 && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onClear}>Clear {activeCount} filter{activeCount > 1 ? 's' : ''}</button>
      )}
    </form>
  );
}
