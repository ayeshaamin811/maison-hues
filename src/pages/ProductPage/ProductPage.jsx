import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import useProduct from "../../hooks/useProduct";
import { ErrorState } from "../../components/ProductStates/ProductStates";
import CartContext from "../../context/CartContext";
import WishlistContext from "../../context/WishlistContext";

// Size guide reference image — apni image is naam se assets folder mein rakh dein
import sizeGuideImg from "../../assets/size-guide.png";

import "./ProductPage.css";

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
    <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
    <path
      d="M12 5V19M5 12H19"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Heart icon for the wishlist button.
// When `filled` is true it renders a solid heart (product is in the wishlist),
// otherwise it renders an outline heart.
const HeartIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill={filled ? "black" : "none"}
    stroke="black"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path
      d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z"
      stroke="black"
      strokeWidth="1.3"
    />
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path
      d="M4 13v-1a8 8 0 0116 0v1M4 13v4a2 2 0 002 2h1v-6H5a1 1 0 00-1 1zM20 13v4a2 2 0 01-2 2h-1v-6h1a1 1 0 011 1z"
      stroke="black"
      strokeWidth="1.3"
    />
  </svg>
);

const PaymentIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="black" strokeWidth="1.3" />
    <path d="M3 10h18" stroke="black" strokeWidth="1.3" />
  </svg>
);

const ReturnIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path
      d="M4 12a8 8 0 1 1 2.34 5.66M4 12v5h5"
      stroke="black"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

// Dummy size chart data — abhi static hai, baad mein backend se
// har product ke apne measurements aa sakte hain agar zaroorat pare.
// Filhaal generic chart hai jaisa reference image mein hai.
const sizeMeasurements = {
  XS: { bodyLength: 56, chestWidth: 50, sleeveLength: 76 },
  S: { bodyLength: 58, chestWidth: 56, sleeveLength: 78 },
  M: { bodyLength: 60, chestWidth: 60, sleeveLength: 80 },
  L: { bodyLength: 62, chestWidth: 64, sleeveLength: 82 },
  XL: { bodyLength: 64, chestWidth: 68, sleeveLength: 84 },
};

// CM ko approximate INCH mein convert karne ka helper.
const cmToInch = (cm) => (cm / 2.54).toFixed(0);

// Loading placeholder. Page ke apne layout classes reuse karta hai taake
// gallery aur info panel wahi jagah lein jo asli content leta hai.
function ProductDetailSkeleton() {
  return (
    <section className="product-page w-full" aria-busy="true">
      <div className="product-page-container flex">
        <div className="product-gallery">
          <div className="ps-block" />
          <div className="ps-block" />
        </div>
        <div className="product-info-panel">
          <div className="ps-line" />
          <div className="ps-line ps-line-short" />
          <div className="ps-line" />
          <div className="ps-line" />
          <div className="ps-line ps-line-short" />
        </div>
      </div>
    </section>
  );
}

export default function ProductPage() {
  const { id } = useParams();

  // Product ab API se aata hai: GET /api/products/<id>/
  const { product, loading, error, notFound, retry } = useProduct(id);

  // Ye states khali shuru hoti hain kyunki pehle render par product abhi
  // aaya nahi hota. Data aate hi neeche wala useEffect inhein bhar deta hai.
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState("");

  // Size Guide popup ka open/close state, aur usme currently selected size tab.
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [guideSize, setGuideSize] = useState("");

  // Get the addToCart function from the global cart context.
  const { addToCart } = useContext(CartContext);

  // Get wishlist helpers from the global wishlist context:
  // toggleWishlist adds/removes the product, isInWishlist tells us whether the
  // heart should be shown filled (already saved) or as an outline.
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  // Jab product load ho jaye to wahi defaults set karo jo pehle static data
  // ke saath the: aakhri size selected, size guide pehle size par.
  useEffect(() => {
    if (!product?.sizes?.length) return;

    setSelectedSize(product.sizes[product.sizes.length - 1]);
    setGuideSize(product.sizes[0]);
    setIsCustomSize(false);
    setCustomSize("");
    setQuantity(1);
  }, [product]);

  if (loading) {
    return (
      <>
        <Navbar />
        <ProductDetailSkeleton />
        <Footer />
      </>
    );
  }

  // Request hi fail hui (backend band, network error) — retry dikhao.
  if (error) {
    return (
      <>
        <Navbar />
        <ErrorState
          message="Sorry, we couldn't load this product."
          onRetry={retry}
        />
        <Footer />
      </>
    );
  }

  // 404 ya deactivated product — pehle wali not-found screen.
  if (notFound || !product) {
    return (
      <>
        <Navbar />
        <div className="product-not-found">Product not found.</div>
        <Footer />
      </>
    );
  }

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Add the current product (with the selected size & quantity) to the
  // cart. The cart context also opens the drawer for us after adding.
  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  // Currently selected size ka measurement data (agar mil jaye)
  const currentMeasurements = sizeMeasurements[guideSize];

  return (
    <>
      <Navbar />

      <section className="product-page w-full">
        <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>
        <div className="product-page-container flex">
          {/* LEFT: Image gallery — jitni images ho, utni grid mein aa jayengi */}
          <div className="product-gallery">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} image ${index + 1}`}
                className="product-gallery-image"
              />
            ))}
          </div>

          {/* RIGHT: Sticky info panel */}
          <div className="product-info-panel">
            <h1 className="product-page-title">{product.name}</h1>

            <span className="product-sku">#{product.sku}</span>

            <p className="product-page-price">{product.price}</p>

            <p className="product-rewards">
              Earn <strong>{product.rewardMin}</strong> -{" "}
              <strong>{product.rewardMax}</strong> in rewards! Simply register
              or sign in to our loyalty program at checkout.
            </p>

            <p className="product-composition">{product.composition}</p>
            <p className="product-shirt-label">
              <strong>Shirt</strong>
            </p>
            <p className="product-shirt-detail">{product.shirtDetail}</p>

            <button
              className="read-more-btn"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "READ LESS -" : "READ MORE +"}
            </button>

            {showDetails && (
              <ul className="product-details-list">
                {product.details.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            )}

            <div className="product-size-section">
              {/* Size label + Size Guide link ek row mein */}
              <div className="size-label-row flex items-center justify-between">
                <p className="size-label">
                  SIZE <strong>{selectedSize}</strong>
                </p>
                <button
                  type="button"
                  className="size-guide-link"
                  onClick={() => {
                    setGuideSize(
                      product.sizes.includes(selectedSize)
                        ? selectedSize
                        : product.sizes[0]
                    );
                    setShowSizeGuide(true);
                  }}
                >
                  SIZE GUIDE
                </button>
              </div>

              <div className="size-options flex">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={
                      "size-button" +
                      (size === selectedSize ? " size-button-active" : "")
                    }
                    onClick={() => {
                      setSelectedSize(size);
                      setIsCustomSize(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
                <button
                  className={
                    "size-button custom-size-btn" +
                    (isCustomSize ? " size-button-active" : "")
                  }
                  onClick={() => {
                    if (isCustomSize) {
                      // Turning custom off -> restore default size.
                      setCustomSize("");
                      setSelectedSize(product.sizes[product.sizes.length - 1]);
                      setIsCustomSize(false);
                    } else {
                      setSelectedSize("");
                      setIsCustomSize(true);
                    }
                  }}
                >
                  Custom
                </button>
              </div>

              {isCustomSize && (
                <div className="custom-size-input">
                  <input
                    type="text"
                    placeholder="Enter your size"
                    value={customSize}
                    onChange={(e) => {
                      setCustomSize(e.target.value);
                      setSelectedSize(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="product-action-row flex items-center">
              <div className="quantity-selector flex items-center">
                <button
                  className="qty-btn"
                  onClick={decreaseQty}
                  aria-label="Decrease quantity"
                >
                  <MinusIcon />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={increaseQty}
                  aria-label="Increase quantity"
                >
                  <PlusIcon />
                </button>
              </div>

              <button
                className="add-to-cart-btn theme-btn"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>

              <button
                className={
                  "wishlist-btn" +
                  (isInWishlist(product.id) ? " wishlist-btn-active" : "")
                }
                aria-label={
                  isInWishlist(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                onClick={() => toggleWishlist(product)}
              >
                <HeartIcon filled={isInWishlist(product.id)} />
              </button>
            </div>

            <p className="stock-warning">
              Only {product.stock} left in stock. Order soon.
            </p>

            <ul className="delivery-checklist">
              <li>✓ Safe & Tracked Delivery</li>
              <li>✓ Secure online payment</li>
            </ul>

            <div className="info-cards-grid">
              <div className="info-card">
                <TruckIcon />
                <span>SAFE & TRACKED DELIVERY</span>
              </div>
              <div className="info-card">
                <SupportIcon />
                <span>24/7 SUPPORT</span>
              </div>
              <div className="info-card">
                <PaymentIcon />
                <span>SECURE PAYMENT</span>
              </div>
              <div className="info-card">
                <ReturnIcon />
                <span>EASY RETURNS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIZE GUIDE MODAL ================= */}
      {showSizeGuide && (
        <div
          className="size-guide-overlay"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="size-guide-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="size-guide-close"
              aria-label="Close size guide"
              onClick={() => setShowSizeGuide(false)}
            >
              ✕
            </button>

            <div className="size-guide-content">
              {/* LEFT: title, size tabs, measurements table */}
              <div className="size-guide-left">
                <h2 className="size-guide-title">Size Guide</h2>

                <p className="size-guide-select-label">Select size</p>
                <div className="size-guide-tabs">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={
                        "size-guide-tab" +
                        (size === guideSize ? " size-guide-tab-active" : "")
                      }
                      onClick={() => setGuideSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {currentMeasurements ? (
                  <table className="size-guide-table">
                    <thead>
                      <tr>
                        <th>MEASUREMENTS</th>
                        <th>CM</th>
                        <th>INCH</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Body Length</td>
                        <td>{currentMeasurements.bodyLength}</td>
                        <td>{cmToInch(currentMeasurements.bodyLength)}</td>
                      </tr>
                      <tr>
                        <td>Chest Width</td>
                        <td>{currentMeasurements.chestWidth}</td>
                        <td>{cmToInch(currentMeasurements.chestWidth)}</td>
                      </tr>
                      <tr>
                        <td>Sleeve Length From Neck Seam</td>
                        <td>{currentMeasurements.sleeveLength}</td>
                        <td>{cmToInch(currentMeasurements.sleeveLength)}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="size-guide-no-data">
                    Measurements not available for this size.
                  </p>
                )}

                <p className="size-guide-note">
                  Note: The size guide refers to product measurements which
                  may slightly vary according to design.
                </p>
              </div>

              {/* RIGHT: reference measurement image */}
              <div className="size-guide-right">
                <img src={sizeGuideImg} alt="Size guide measurement reference" />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}