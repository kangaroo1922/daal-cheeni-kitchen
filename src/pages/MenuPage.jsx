import { useState } from 'react';
import DishCard from '../components/DishCard.jsx';
import { CATEGORIES } from '../data/menu.js';

export default function MenuPage({ menu }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState('popular');

  const text = query.trim().toLowerCase();
  const results = menu
    .filter((d) => !text || `${d.name} ${d.description}`.toLowerCase().includes(text))
    .filter((d) => category === 'all' || d.category === category)
    .filter((d) => !vegOnly || d.vegetarian)
    .toSorted((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="container page">
      <h1>Today&apos;s menu</h1>
      <div className="filters">
        <label>Search <input value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label><input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} /> Vegetarian only</label>
        <label>Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Menu order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
      {results.length === 0 ? <p>No dishes match your search.</p> : (
        <div className="dish-grid">
          {results.map((dish) => <DishCard key={dish.id} dish={dish} />)}
        </div>
      )}
    </div>
  );
}
