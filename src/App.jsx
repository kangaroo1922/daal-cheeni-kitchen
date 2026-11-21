import { useEffect, useState } from 'react';
import { fetchMenu } from './services/menuApi.js';

export default function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu().then((items) => {
      setMenu(items);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      <h1>Daal Cheeni Kitchen</h1>
      {loading ? <p>Loading today&apos;s menu…</p> : (
        <ul>
          {menu.map((item) => (
            <li key={item.id}>{item.name} – Rs {item.price}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
