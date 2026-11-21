# Daal Cheeni Kitchen – React Business Website

**Student:** _Your Name_ · **Roll No:** _24I-XXXX_ · **Section:** _X_ · **Course:** CS4032 Web Programming, Assignment 02

- **GitHub:** https://github.com/YOUR-USERNAME/daal-cheeni-kitchen
- **Live site:** https://YOUR-PROJECT.vercel.app

## Description

Daal Cheeni Kitchen is a fictional home-style meal kitchen in **H-11 Markaz, Islamabad**, serving **university students** in nearby sectors. Customers browse today's menu, search and filter dishes, check allergens and availability, build a cart, choose delivery or pickup, and place a **simulated** order.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Run locally (dev) | `npm run dev` → http://localhost:5173 |
| Production build | `npm run build` (output in `dist/`) |
| Preview build | `npm run preview` |
| Business-rule test | `npm test` (runs `node --test tests/orderRules.test.js`) |

Requires Node.js 18 or newer.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home: offer, delivery area, fees and limits up front |
| `/menu` | Browse, search, filter, sort; allergen preferences. Filters are stored in the URL (`?q=&cat=&sort=&veg=1&avail=1&safe=1`) |
| `/menu/:id` | Dish details, quantity and add to cart. Unknown IDs show a "Dish not found" page with suggestions |
| `/cart` | Change quantities, remove items, fix conflicts, see the calculated summary |
| `/checkout` | Controlled, validated form (name, phone, delivery/pickup, sector, address or pickup slot, notes) |
| `/order/confirmed` | Confirmation with order number, items and totals (survives a refresh) |
| `*` | 404 page |

## Features

- 14 menu records in `src/data/menu.js`, loaded through an async mock loader with loading, error and retry states.
- Search (name, description, category), category filter, vegetarian / available / allergen-safe filters, 5 sort options.
- Cart shared across all pages; saved to `localStorage` with the allergen preferences.
- Three business rules (see below) enforced in the UI and checked before checkout.
- Responsive layout (tested at 390 px and 1280 px), keyboard accessible, visible focus.

### Operating rules (`src/rules/orderRules.js`)

1. **Availability:** 1–5 portions per dish per order, and never more than today's stock. Sold-out dishes can't be added.
2. **Eligibility (allergens):** dishes containing an allergen the customer avoids can't be added; conflicting cart items block checkout.
3. **Fulfilment & pricing:** delivery only to G-9, G-10, G-11, H-8 to H-12 and I-8; minimum order Rs 800 for delivery; Rs 150 fee, free from Rs 2,000. Pickup has no minimum.

## Reproducing edge cases

Open the **🧪 Demo controls** panel in the footer of any page, tick an option, then press **Apply and reload menu**.

| Case | How to reproduce | Expected |
|---|---|---|
| Loading failure | Tick "Make menu loading fail" → Apply | Error message + **Try again**; Try again loads the menu |
| Empty dataset | Tick "Simulate an empty menu" → Apply | "Today's menu hasn't been published yet" (different from no-match message) |
| Changed availability / restored cart | Add 3+ Chicken Biryani, Palak Paneer and Kheer → tick "Simulate changed availability" → Apply → open Cart | Biryani over limit ("Change to 2"), Palak sold out, Kheer no longer on menu; checkout disabled until fixed |
| No search matches | Search "pizza" | "No dishes match" with Clear search / Show all buttons |
| Invalid URL | Visit `/menu/pizza-supreme` or `/abc` | Not-found message with link back |
| Missing image | Gajar Halwa (broken image path) and Mint Margarita (no image) | "Photo coming soon" placeholder |
| Invalid form input | Submit checkout with name "A" and phone "12345" | Specific messages per field; other answers kept; focus moves to first error |
| Minimum order | Add only one Doodh Patti and go to checkout with Delivery | Order blocked, "Add Rs 680 more or choose pickup" |

Untick the options (or clear site data) to return to normal.

## Simulated operations & limitations

- Orders are **simulated**: nothing is sent to a server, no payment is taken. Only first name, items and totals are kept in `localStorage` (no phone or address).
- Placing an order does not reduce stock in the local data (there is no backend).
- Stock and menu are the same every day; times are estimates.
- Allergen information is customer-declared filtering only, not a medical guarantee.

## Concept map

| Concept | File | Component / function |
|---|---|---|
| Components, imports/exports | `src/components/*`, `src/pages/*` | e.g. `DishCard`, `CartPage` |
| Props | `src/pages/MenuPage.jsx` | passes `dish`, `avoided`, `inCartQty` to `DishCard` |
| Callback props | `src/App.jsx` → `DishCard`, `CartLine` | `addToCart`, `updateQty`, `removeFromCart` |
| Events + preventDefault | `src/pages/CheckoutPage.jsx` | `handleSubmit`, `handleChange`, `handleBlur` |
| useState / controlled inputs | `src/pages/CheckoutPage.jsx` | `form` state, `Field` |
| Functional updates | `src/App.jsx` | `setCart((prev) => ...)`, `setReloadKey((k) => k + 1)` |
| Object updates (no mutation) | `src/pages/CheckoutPage.jsx` | `setForm((prev) => ({ ...prev, [name]: value }))` |
| Array add/remove/update | `src/App.jsx` | `addToCart` (spread / map), `removeFromCart` (filter) |
| Lists & keys | `src/pages/MenuPage.jsx`, `CartPage.jsx` | `key={dish.id}`, `key={line.id}` |
| Conditional rendering | `src/components/DataState.jsx`, `DishCard.jsx` | loading / error / sold out / allergen states |
| Shared state | `src/App.jsx` | `menu`, `cart`, `avoided` passed to every page |
| Derived values | `src/components/OrderSummary.jsx`, `src/utils/cartUtils.js` | subtotal, fee, total, time, `getCartIssues` |
| useEffect + cleanup | `src/App.jsx`, `src/hooks/usePageTitle.js` | menu loader (`ignore` flag), title restore |
| Async code | `src/services/menuApi.js`, `src/App.jsx` | `fetchMenu` (Promise), `async load()` with try/catch |
| localStorage | `src/utils/storage.js`, `src/App.jsx` | `loadJSON`, `saveJSON`, sanitizers |
| Routing & URL params | `src/App.jsx`, `DishDetailsPage.jsx`, `MenuPage.jsx` | `Routes`, `useParams`, `useSearchParams`, `useNavigate` |
| Business-rule test | `tests/orderRules.test.js` | tests `checkFulfilment` |

## Deployment

Deployed on Vercel. `vercel.json` rewrites every path to `index.html` so refreshing nested routes like `/menu/kheer` works. (`public/_redirects` does the same on Netlify.)
