# Backend Task 01 — Products API

Django + DRF products API for an existing React storefront.
**Products only** — no auth, cart, orders, or payment (payment method not decided yet).

## Models

- **Collection** (FK, one per product) — `solids, embroidered, unstitched, casual, west, formals`
- **Fabric** (FK, nullable) — `lawn, crepe, matte-twill, linen, silk`
- **Edit** (M2M) — `new-arrivals, formal-edit, co-ordsets, fusion-edit`
- **Product** — name, sku, price, old_price, discount, reward_min, reward_max, image,
  hover_image, composition, shirt_detail, details(JSON list), sizes(JSON list),
  stock, is_best_seller, is_active, created_at
- **ProductImage** — FK product, image, position

Slugs above are exact (already live in frontend URLs). Seed these 15 rows via migration.

## Endpoints

```
GET /api/products/        paginated 24, is_active only
GET /api/products/<id>/
```

Filters (must be combinable): `collection`, `fabric`, `edit`, `is_best_seller`,
`size`, `min_price`, `max_price`, `search`, `sort`, `page`.
Unknown slug → 200 with empty results, not 404.

## Response — exact keys, camelCase

```json
{
  "count": 26, "next": "...", "previous": null,
  "results": [{
    "id": 1,
    "name": "2 Pc Printed Cambric Suit",
    "category": ["casual", "new-arrivals", "lawn"],
    "sku": "MB-MN26-08-BLACK",
    "price": "Rs.6,990.00",
    "priceValue": 6990.00,
    "oldPrice": null,
    "discount": null,
    "rewardMin": "Rs. 280",
    "rewardMax": "Rs. 699",
    "image": "http://127.0.0.1:8000/media/products/image-1.webp",
    "hoverImage": "http://127.0.0.1:8000/media/products/image-1-hover.webp",
    "images": ["...", "..."],
    "composition": "2 Piece - Shirt & Trouser",
    "shirtDetail": "Printed Straight Shirt",
    "details": ["Fabric: Cambric", "Wash Care: Dry clean only"],
    "sizes": ["XS", "S", "M", "L", "XL"],
    "stock": 2,
    "isBestSeller": false
  }]
}
```

## Rules

1. `category` = collection slug + edit slugs + fabric slug, flat array.
2. `price` exactly `"Rs.6,990.00"` — frontend strips `Rs.` and commas then `parseFloat`.
   Wrong format = wrong cart totals, silently.
3. `rewardMin`/`rewardMax` use a different format: `"Rs. 280"` (space, no decimals).
4. Image URLs must be absolute — pass `request` into serializer context.
5. `oldPrice`/`discount` → `null` when absent, not `""` or `0`.
6. `images` falls back to `[image, hoverImage]` if no gallery rows.

## Also

- **Admin**: full CRUD, `list_filter` on collection/fabric/edits/is_best_seller,
  `filter_horizontal` on edits, ProductImage as inline. Adding a product must need no code.
- **CORS**: allow `http://localhost:3000`
- **Seed**: port the 26 products from the frontend's `src/data/products.jsx`
