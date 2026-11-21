import { Link, useParams } from 'react-router-dom';
import DishImage from '../components/DishImage.jsx';
import { ALLERGENS } from '../data/menu.js';
import { formatPrice, spiceLabel } from '../utils/format.js';

export default function DishDetailsPage({ menu }) {
  const { id } = useParams();
  const dish = menu.find((d) => d.id === id);

  if (!dish) {
    return (
      <div className="container page state-box">
        <h1>Dish not found</h1>
        <p>We couldn&apos;t find a dish with the ID “{id}”.</p>
        <Link className="btn btn-primary" to="/menu">Back to the menu</Link>
      </div>
    );
  }

  return (
    <div className="container page details">
      <DishImage src={dish.image} name={dish.name} className="details-image" />
      <div>
        <h1>{dish.name}</h1>
        <p className="price">{formatPrice(dish.price)}</p>
        <p>{dish.description}</p>
        <ul>
          <li>Prep time: {dish.prepMinutes} min</li>
          <li>Spice: {spiceLabel(dish.spiceLevel)}</li>
          <li>Contains: {dish.allergens.length ? dish.allergens.map((a) => ALLERGENS[a]).join(', ') : 'No listed allergens'}</li>
          <li>{dish.stock > 0 ? `${dish.stock} portions left today` : 'Sold out today'}</li>
        </ul>
      </div>
    </div>
  );
}
