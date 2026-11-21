import { ALLERGENS } from '../data/menu.js';

// Checkbox group; sends the new array up via onChange (callback prop).
export default function AllergenPreferences({ avoided, onChange }) {
  function toggle(key) {
    onChange(avoided.includes(key) ? avoided.filter((a) => a !== key) : [...avoided, key]);
  }
  return (
    <fieldset className="allergen-prefs">
      <legend>I avoid</legend>
      <div className="chip-options">
        {Object.entries(ALLERGENS).map(([key, label]) => (
          <label key={key} className={`chip-option ${avoided.includes(key) ? 'is-selected' : ''}`}>
            <input type="checkbox" checked={avoided.includes(key)} onChange={() => toggle(key)} />
            {label}
          </label>
        ))}
      </div>
      <p className="hint">Saved on this device. Dishes containing these are marked and can’t be added.</p>
    </fieldset>
  );
}
