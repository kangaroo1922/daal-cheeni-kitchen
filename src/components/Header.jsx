import { Link, NavLink } from 'react-router-dom';

export default function Header({ cartCount = 0 }) {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img src="/images/logo.svg" alt="" width="36" height="36" />
          <span>Daal Cheeni <small>Kitchen</small></span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/menu">Menu</NavLink></li>
            <li>
              <NavLink to="/cart">
                Cart <span className="badge" aria-label={`${cartCount} items`}>{cartCount}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
