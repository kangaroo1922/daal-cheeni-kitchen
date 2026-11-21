// Availability shown as text + colour (never colour alone).
export default function StockBadge({ stock }) {
  if (stock <= 0) return <span className="tag tag-danger">Sold out today</span>;
  if (stock <= 3) return <span className="tag tag-warning">Only {stock} left</span>;
  return <span className="tag tag-success">Available</span>;
}
