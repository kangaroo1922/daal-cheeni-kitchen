import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page state-box">
      <h1>Page not found</h1>
      <p>This address doesn&apos;t match any page on our site.</p>
      <Link className="btn btn-primary" to="/menu">Go to the menu</Link>
    </div>
  );
}
