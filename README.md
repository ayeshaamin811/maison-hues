# Maison Hues

Storefront for **Maison Hues**, a Pakistani women's clothing label — built as a React single-page app with Create React App. Product data is currently static and shipped with the bundle; the app is structured so it can be swapped for a Django REST backend without touching the UI components.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 (`react-scripts` 5 / Create React App) |
| Routing | `react-router-dom` v6 (`BrowserRouter`) |
| State | React Context API (cart, auth, wishlist) |
| Styling | Per-component CSS files + Tailwind CSS 3 (via PostCSS) |
| Carousels | `swiper`, `embla-carousel-react`, `react-owl-carousel` |
| Icons | `react-icons` |
| HTTP | `axios` (installed, not wired up yet) |
| Auth (planned) | `@react-oauth/google` |

---

## Getting started

```bash
npm install
npm start      # dev server on http://localhost:3000
npm run build  # production bundle into build/
```

There is no test script and no `.env` in the repo. `.env` is gitignored — add one when the API base URL is introduced.

---

## Project structure

```
src/
├── App.js                 # Router + all provider wiring
├── index.js               # ReactDOM entry (mounts <App /> into #root)
├── main.jsx               # Vite-style entry, currently unused — see "Known issues"
├── index.css              # Global styles + Tailwind directives
├── assets/                # Images, banners, product photos, project-video.mp4
├── data/
│   └── products.jsx       # 26 static products (the future API boundary)
├── context/
│   ├── CartContext.js     # Cart state, persisted to localStorage
│   ├── WishlistContext.js # Wishlist state, persisted to localStorage
│   └── AuthContext.js     # Mock auth + modal visibility (in-memory only)
├── components/            # Reusable UI, one folder per component (.jsx + .css)
└── pages/                 # Route-level screens
```

Every component and page lives in its own folder with a co-located CSS file, e.g. [Navbar.jsx](src/components/Navbar/Navbar.jsx) + [Navbar.css](src/components/Navbar/Navbar.css). A few small pages (`FaqPage`, `ExchangePolicy`, `TermsAndConditions`, `PrivacyPolicy`) sit directly in [src/pages/](src/pages/).

---

## Routes

Defined in [App.js](src/App.js#L36-L61).

| Path | Page |
| --- | --- |
| `/` | [home.jsx](src/pages/home.jsx) — hero, collections, best sellers, FAQ |
| `/product/:id` | [ProductPage](src/pages/ProductPage/ProductPage.jsx) |
| `/collection/:categoryName` | [CollectionPage](src/pages/CollectionPage/CollectionPage.jsx) — the one grid used by every category |
| `/cart` | [CartPage](src/pages/CartPage/CartPage.jsx) |
| `/checkout` | [CheckoutPage](src/pages/CheckoutPage/CheckoutPage.jsx) |
| `/order-confirmation` | [OrderConfirmation](src/pages/OrderConfirmation/OrderConfirmation.jsx) — reads the order from router `state` |
| `/wishlist` | [WishlistPage](src/pages/WishlistPage/WishlistPage.jsx) |
| `/track-order` | [TrackOrder](src/pages/TrackOrder/TrackOrder.jsx) |
| `/store-locator` | [StoreLocator](src/pages/StoreLocator/StoreLocator.jsx) |
| `/about`, `/contact-us`, `/faqs` | Static content pages |
| `/terms`, `/privacy-policy`, `/exchange-policy` | Policy pages |

**Main-menu redirects.** `/new-arrivals`, `/formal-edit`, `/co-ordsets` and `/fusion-edit` are `<Navigate replace>` aliases onto `/collection/:categoryName`, so `CollectionPage` always receives its category through `useParams()` and there is only one grid implementation to maintain.

Because these are real paths rather than hash routes, **any host must rewrite unknown paths to `index.html`** or a deep link will 404.

---

## Product data

[src/data/products.jsx](src/data/products.jsx) exports a flat array of 26 products. Each entry:

```js
{
  id: 1,
  name: "2 Pc Printed Cambric Suit",
  category: ["casual", "new-arrivals"],   // array — a product can live in several collections
  sku: "MB-MN26-08-BLACK-EX LARGE",
  price: "Rs.6,990.00",                   // string, pre-formatted
  oldPrice: null,
  discount: null,
  rewardMin: "Rs. 280",
  rewardMax: "Rs. 699",
  image, hoverImage, images: [...],       // imported webp modules
  composition: "2 Piece - Shirt & Trouser",
  shirtDetail: "Printed Straight Shirt",
  details: ["Fabric: Cambric", "Wash Care: …", "Country of Origin: Pakistan"],
  sizes: ["XS", "S", "M", "L", "XL"],
  stock: 2,
}
```

`category` is an array, and filtering is `product.category.includes(categoryName)`. Two families of category slugs coexist:

- **By Collection** — `casual`, `solids`, `unstitched`, `west`, `formals`, `embroidered`
- **Main Menu** — `new-arrivals`, `formal-edit`, `co-ordsets`, `fusion-edit`

Plus the virtual `best-sellers` slug, which `CollectionPage` special-cases to show everything rather than filtering. Display titles for each slug live in the `categoryTitles` map at [CollectionPage.jsx:11](src/pages/CollectionPage/CollectionPage.jsx#L11) — **adding a category means adding an entry there too**, otherwise the page falls back to a generic heading.

`price` is a formatted string, so anything arithmetic (cart subtotal, checkout total) has to parse it back to a number first.

---

## State management

Three providers wrap the app, nested in this order in [App.js](src/App.js#L30-L34): `CartProvider` → `AuthProvider` → `WishlistProvider` → `Router`.

### CartContext
`cartItems`, `addToCart(product, size, quantity)`, `updateQuantity(id, size, qty)`, `removeFromCart(id, size)`, `clearCart()`, `cartCount`, `isCartOpen`, `setIsCartOpen`.

Cart lines are keyed by **`id` + `size`**, so the same garment in two sizes is two lines while a repeat add of the same size merges quantities. Adding opens the cart drawer. Persisted to `localStorage` under `maison-hues-cart`; every read and write is wrapped in `try/catch` so private mode or a blocked/corrupt store degrades to an empty in-memory cart instead of crashing.

### WishlistContext
`wishlistItems`, `addToWishlist`, `removeFromWishlist`, `toggleWishlist`, `isInWishlist(id)`, `wishlistCount`. Keyed by `id` alone (no size), same `localStorage` treatment under `maison-hues-wishlist`.

### AuthContext
`user`, `login(email, password)`, `signup(name, email, password)`, `logout()`, `isAuthModalOpen`, `setIsAuthModalOpen`.

**This is a mock.** `login` fabricates a user from the email local-part and validates nothing; there is no password check, no token, no persistence — a refresh logs you out. It is a placeholder for the Django auth endpoints.

---

## Checkout flow

1. [CheckoutPage](src/pages/CheckoutPage/CheckoutPage.jsx) redirects to `/cart` if the cart is empty.
2. Collects contact, shipping address, and payment method (`cod` default, or card fields).
3. Shipping is hardcoded to **0**, so `total === subtotal`.
4. On submit it snapshots items + shipping + total into an order object, navigates to `/order-confirmation` passing it via router `state`, then clears the cart.

Nothing is posted anywhere — no order is persisted, and the confirmation page is lost on refresh because the snapshot only exists in navigation state. Card details are collected in plain component state and discarded.

---

## Wiring up the Django backend

The seams are already in place:

1. **Products** — replace the static array in [products.jsx](src/data/products.jsx) with a fetch of the same shape. `Casualcollections`, `Solidscollection`, `CollectionPage` and `ProductPage` all consume that shape and need no changes. `ProductPage` already marks its call site at [ProductPage.jsx:107](src/pages/ProductPage/ProductPage.jsx#L107).
2. **Auth** — swap the three mock functions in `AuthContext` for API calls and add token storage. `@react-oauth/google` is installed for the social path.
3. **Orders** — POST the order object built in `CheckoutPage` before navigating, and have the server return the order number `OrderConfirmation` displays.
4. **Order tracking** — `TrackOrder` is UI-only and needs a lookup endpoint.

`axios` is already a dependency for all of the above.

---

## Known issues / rough edges

These are real, currently in the tree, and worth knowing before you touch nearby code:

- **[index.js](src/index.js#L8-L15) renders `<App />` bare.** The `GoogleOAuthProvider` below it is a dangling JSX expression that is never rendered and never mounted, and its `clientId` is still the literal `"YOUR_GOOGLE_CLIENT_ID"`. Google sign-in cannot work until `<App />` is actually wrapped.
- **[main.jsx](src/main.jsx) is dead code** — a Vite-style entry importing `./App.jsx` (which doesn't exist; the file is `App.js`). CRA only uses `index.js`. Delete it or migrate deliberately.
- **`src/data/products.jsx.bak`** is a stray backup committed to the repo.
- **Tailwind is only half-adopted** — configured and scanning `src/**/*.{js,jsx,ts,tsx}`, but the actual styling is hand-written per-component CSS. Expect both idioms.
- **Navbar links use raw `<a href>`** rather than `<Link>`, so menu navigation triggers a full page reload and throws away in-memory state (notably the logged-in user). The cart and wishlist survive because they're in `localStorage`.
- **The WhatsApp button uses a placeholder number** — `923001234567` in [App.js](src/App.js#L35).
- **[public/index.html](public/index.html) is minimal** — no favicon, no meta description, no Open Graph tags, no `manifest.json`. Worth filling in before launch.
- **Three carousel libraries are installed** (`swiper`, `embla-carousel-react`, `react-owl-carousel`) where one would do. `react-owl-carousel` also needs jQuery at runtime.
- **Comments are mixed English and Roman Urdu** across `products.jsx`, `ProductPage`, and `CollectionPage`.
- **No tests** and no test runner script.

---

## Build & deploy

`npm run build` emits a static bundle to `build/`. The folder is gitignored. Serve it from any static host, with the SPA rewrite described under [Routes](#routes). A Railway MCP server is configured for this workspace, which suggests Railway is the intended target.
