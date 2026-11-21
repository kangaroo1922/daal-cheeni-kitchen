import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileCartBar from './components/MobileCartBar.jsx';
import DataState from './components/DataState.jsx';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import DishDetailsPage from './pages/DishDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { clearSimulatedFailure, fetchMenu } from './services/menuApi.js';
import { checkQuantity, getAllergenConflicts, getMaxQuantity } from './rules/orderRules.js';
import { buildCartLines, getItemCount, getSubtotal, sanitizeAllergens, sanitizeSavedCart } from './utils/cartUtils.js';
import { loadJSON, saveJSON, STORAGE_KEYS } from './utils/storage.js';

// App owns the shared state (menu, cart, allergen preferences) and passes it down as props.
// Children change it only through the callback props below.
export default function App() {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  // Lazy initial state: read localStorage once on first render.
  const [cart, setCart] = useState(() => sanitizeSavedCart(loadJSON(STORAGE_KEYS.cart, [])));
  const [avoided, setAvoided] = useState(() => sanitizeAllergens(loadJSON(STORAGE_KEYS.allergens, [])));

  // Load the menu; re-runs when reloadKey changes (the Retry button).
  useEffect(() => {
    let ignore = false; // cleanup flag: ignore a result that arrives after the effect re-ran or unmounted
    async function load() {
      setStatus('loading');
      try {
        const items = await fetchMenu();
        if (!ignore) { setMenu(items); setStatus('ready'); }
      } catch (err) {
        if (!ignore) { setError(err.message); setStatus('error'); }
      }
    }
    load();
    return () => { ignore = true; };
  }, [reloadKey]);

  // Keep localStorage in sync with state.
  useEffect(() => { saveJSON(STORAGE_KEYS.cart, cart); }, [cart]);
  useEffect(() => { saveJSON(STORAGE_KEYS.allergens, avoided); }, [avoided]);

  // ----- cart actions (immutable array updates) -----
  function addToCart(dish, qty = 1) {
    const current = cart.find((l) => l.id === dish.id)?.qty ?? 0;
    const conflicts = getAllergenConflicts(dish, avoided);
    if (conflicts.length > 0) return { ok: false, message: 'This dish contains an allergen you avoid.' };
    const result = checkQuantity(dish, current + qty);
    if (!result.ok) return result;

    setCart((prev) =>
      prev.some((l) => l.id === dish.id)
        ? prev.map((l) => (l.id === dish.id ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { id: dish.id, qty }]
    );
    return { ok: true };
  }

  function updateQty(id, qty) {
    const dish = menu.find((d) => d.id === id);
    const max = dish ? getMaxQuantity(dish) : 1;
    // Keep the value inside the allowed range shown next to the control.
    const safeQty = Math.min(Math.max(1, Math.floor(qty) || 1), Math.max(max, 1));
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: safeQty } : l)));
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }

  function placeOrder(order) {
    saveJSON(STORAGE_KEYS.lastOrder, order);
    setCart([]);
  }

  // Derived values – recalculated each render from current state, never stored separately.
  const lines = status === 'ready' ? buildCartLines(cart, menu) : [];
  const itemCount = getItemCount(cart);
  const reloadMenu = () => setReloadKey((k) => k + 1);
  const retryMenu = () => { clearSimulatedFailure(); reloadMenu(); };
  const dataProps = { status, error, onRetry: retryMenu };

  return (
    <>
      <Header cartCount={itemCount} />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={
            <DataState {...dataProps}>
              <MenuPage menu={menu} cart={cart} avoided={avoided} onAvoidedChange={setAvoided} onAdd={addToCart} />
            </DataState>
          } />
          <Route path="/menu/:id" element={
            <DataState {...dataProps}>
              <DishDetailsPage menu={menu} cart={cart} avoided={avoided} onAdd={addToCart} />
            </DataState>
          } />
          <Route path="/cart" element={
            <DataState {...dataProps}>
              <CartPage lines={lines} avoided={avoided} onUpdateQty={updateQty} onRemove={removeFromCart} onClear={() => setCart([])} />
            </DataState>
          } />
          <Route path="/checkout" element={
            <DataState {...dataProps}>
              <CheckoutPage lines={lines} avoided={avoided} onPlaceOrder={placeOrder} />
            </DataState>
          } />
          <Route path="/order/confirmed" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <MobileCartBar itemCount={itemCount} subtotal={getSubtotal(lines)} />
      <Footer onReload={reloadMenu} />
    </>
  );
}
