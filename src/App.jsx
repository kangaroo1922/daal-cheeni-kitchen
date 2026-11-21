import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import DataState from './components/DataState.jsx';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import DishDetailsPage from './pages/DishDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { fetchMenu } from './services/menuApi.js';

export default function App() {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // Load the menu; re-runs when reloadKey changes (the Retry button).
  useEffect(() => {
    let ignore = false; // cleanup flag: ignore results if the effect re-ran or unmounted
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

  const dataProps = { status, error, onRetry: () => setReloadKey((k) => k + 1) };

  return (
    <>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<DataState {...dataProps}><MenuPage menu={menu} /></DataState>} />
          <Route path="/menu/:id" element={<DataState {...dataProps}><DishDetailsPage menu={menu} /></DataState>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
