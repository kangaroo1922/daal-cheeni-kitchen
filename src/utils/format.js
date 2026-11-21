// Small display helpers shared by several components.
export function formatPrice(amount) {
  return `Rs ${amount.toLocaleString('en-PK')}`;
}

export function spiceLabel(level) {
  return ['Not spicy', 'Mild', 'Medium', 'Hot'][level] ?? 'Unknown';
}
