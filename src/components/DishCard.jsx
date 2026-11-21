import { Link } from 'react-router-dom';
import DishImage from './DishImage.jsx';
import { formatPrice } from '../utils/format.js';

export default function DishCard({ dish }) {
  return (
    <article className="dish-card">
      <DishImage src={dish.image} name={dish.name} />
      <div className="dish-card-body">
        <p className="eyebrow">{dish.category}</p>
        <h3><Link to={`/menu/${dish.id}`}>{dish.name}</Link></h3>
        <p className="price">{formatPrice(dish.price)}</p>
      </div>
    </article>
  );
}
