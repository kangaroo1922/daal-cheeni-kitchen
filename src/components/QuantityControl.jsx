// Stepper with − / + buttons and a numeric input. The parent owns the value (controlled).
export default function QuantityControl({ id, value, max, onChange, label = 'Quantity' }) {
  return (
    <div className="qty-control">
      <label htmlFor={id}>{label}</label>
      <div className="qty-row">
        <button type="button" className="btn btn-icon" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">−</button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min="1"
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-describedby={`${id}-hint`}
        />
        <button type="button" className="btn btn-icon" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">+</button>
      </div>
      <p id={`${id}-hint`} className="hint">1 – {max} portions</p>
    </div>
  );
}
