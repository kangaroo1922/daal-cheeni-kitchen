import { useState } from 'react';

// Shows the dish illustration, or a text fallback when the image is missing or fails to load.
export default function DishImage({ src, name, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`dish-image fallback ${className}`} role="img" aria-label={`No photo available for ${name}`}>
        <span aria-hidden="true">🍽</span>
        <span>Photo coming soon</span>
      </div>
    );
  }
  return (
    <img
      className={`dish-image ${className}`}
      src={src}
      alt={`Illustration of ${name}`}
      onError={() => setFailed(true)}
    />
  );
}
