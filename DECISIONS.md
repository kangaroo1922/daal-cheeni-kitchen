# Frontend Decisions

Reference site: a restaurant menu page on foodpanda.pk (Islamabad), checked on 21 Nov 2026 at desktop width and in Chrome's iPhone 12 Pro view.

## Decision 1 – Show comparison facts on every card (information hierarchy)

| Field | Content |
|---|---|
| **Problem** | Reference menu cards show only a photo, name, price and a description cut off after two lines. No allergens or availability; dairy is only mentioned in truncated text (Problem 1). |
| **Decision** | Each card shows, in order: category + availability badge, name, price, diet/spice/prep time, a "Contains:" allergen line, and a red "Not suitable" warning when it conflicts with the customer's saved "I avoid" allergens. Sold-out cards are greyed and their button says "Sold out". |
| **Alternative** | Keep cards minimal and show these facts only on the details page. |
| **Reason** | Students choosing a cheap, safe meal can compare and rule out dishes without opening each one; allergens and stock decide whether they can order at all. |
| **Tradeoff** | Cards are taller, so fewer fit on one screen, and more text must stay readable at 390 px. |
| **Code location** | `src/components/DishCard.jsx`, `src/components/StockBadge.jsx`, `src/components/AllergenPreferences.jsx`. |
| **Evidence** | Menu → tick "Nuts" under "I avoid" → search "halwa" → card shows "Contains: Dairy, Nuts", a red "Not suitable" label and a disabled button. |

## Decision 2 – Empty search explains why and offers next actions (interaction / state)

| Field | Content |
|---|---|
| **Problem** | Searching "pizza" on the reference menu shows only "No results found"; no explanation, suggestions or button back to the menu (Problem 2). |
| **Decision** | The no-match state names the search text and the category being filtered, suggests what to change, and offers "Clear search" (removes only the search) and "Show all dishes" (resets all filters). An empty dataset shows a different message ("Today's menu hasn't been published yet"). Filters live in the URL, so these buttons update `?q=&cat=…` state. |
| **Alternative** | Automatically show all dishes when nothing matches. |
| **Reason** | The customer stays in control and learns why nothing matched (e.g. they were still inside "Desserts"), and is one tap away from available dishes instead of leaving. |
| **Tradeoff** | Two extra states to build and test (no match vs. empty menu), and one extra tap compared with automatically showing everything. |
| **Code location** | `src/pages/MenuPage.jsx` – no-match and empty-menu branches, `updateFilter`, `clearFilters`. |
| **Evidence** | Menu → search "pizza" → "No dishes match "pizza"" with "Clear search" and "Show all dishes"; pressing "Show all dishes" shows all 14 dishes. |

## Decision 3 – Only one fixed element on mobile; Add buttons inside cards (mobile layout)

| Field | Content |
|---|---|
| **Problem** | In mobile view the reference site's sticky search/category bar floats part-way down the screen and covers the card underneath, including its description and "+" button; the "View Cart" bar covers the bottom (Problem 3). |
| **Decision** | At ≤ 560 px the header scrolls away (not sticky) and filters sit in normal page flow; the only fixed element is the bottom cart bar (≤ 900 px), and the footer has extra bottom padding so nothing is hidden at the end. "Add to cart" is a labelled 44 px button inside the card body, never laid over the photo. |
| **Alternative** | A sticky search/category bar at the top for quick jumps between categories. |
| **Reason** | Students order one-handed on phones; nothing floats over the middle of the screen (only the bottom ~70 px is used by the cart bar), and that bar still keeps the running total and "Add Rs X for delivery" visible. |
| **Tradeoff** | To change search or filters the customer must scroll back to the top. |
| **Code location** | `src/styles/global.css` – `@media (max-width: 900px)` and `(max-width: 560px)` rules (`.site-header`, `.menu-sidebar`, `.mobile-cart-bar`, `.site-footer` padding); `src/components/DishCard.jsx` – `.card-actions`; `src/components/MobileCartBar.jsx`. |
| **Evidence** | At 390 px add Daal Chawal and scroll: only the bottom bar is fixed, the header scrolls away, and each card's "Add to cart" button is fully visible once the card is on screen. |
