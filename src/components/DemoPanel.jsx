import { useState } from 'react';
import { DEFAULT_DEMO, loadJSON, saveJSON, STORAGE_KEYS } from '../utils/storage.js';

// Clearly labelled controls for assessors to reproduce edge cases (see README).
export default function DemoPanel({ onReload }) {
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_DEMO, ...loadJSON(STORAGE_KEYS.demo, {}) }));

  function toggle(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function apply() {
    saveJSON(STORAGE_KEYS.demo, settings);
    onReload();
  }
  // Re-read saved settings when the panel opens (Retry may have cleared the failure flag).
  function handleToggle(e) {
    if (e.currentTarget.open) setSettings({ ...DEFAULT_DEMO, ...loadJSON(STORAGE_KEYS.demo, {}) });
  }

  return (
    <details className="demo-panel" onToggle={handleToggle}>
      <summary>🧪 Demo controls (for testing edge cases)</summary>
      <label><input type="checkbox" checked={settings.failNextLoad} onChange={() => toggle('failNextLoad')} /> Make menu loading fail (Retry clears it)</label>
      <label><input type="checkbox" checked={settings.emptyMenu} onChange={() => toggle('emptyMenu')} /> Simulate an empty menu (nothing published)</label>
      <label><input type="checkbox" checked={settings.changedAvailability} onChange={() => toggle('changedAvailability')} /> Simulate changed availability (biryani: 2 left, palak paneer: sold out, kheer: removed)</label>
      <button type="button" className="btn btn-secondary btn-sm" onClick={apply}>Apply and reload menu</button>
    </details>
  );
}
