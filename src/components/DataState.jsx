// Wraps pages that need the menu: shows loading and error states, otherwise renders children.
export default function DataState({ status, error, onRetry, children }) {
  if (status === 'loading') {
    return (
      <div className="state-box" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Loading today&apos;s menu…</p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="state-box error" role="alert">
        <h2>We couldn&apos;t load the menu</h2>
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>Try again</button>
      </div>
    );
  }
  return children;
}
