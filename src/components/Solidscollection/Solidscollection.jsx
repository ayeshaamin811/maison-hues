import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
// Swiper components + styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Product data ab Django API se aa raha hai
import useProducts from "../../hooks/useProducts";
import {
  CardSkeleton,
  ErrorState,
} from "../ProductStates/ProductStates";

// Our own custom CSS (colors, fonts, hover effects, media queries)
import "./Solidscollection.css";

// Plus icon (simple inline SVG so we don't need an extra icon library)
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <path
      d="M12 5V19M5 12H19"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Simple left arrow icon
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Simple right arrow icon
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path
      d="M9 6L15 12L9 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// One product card. Kept as its own small component so the
// main component stays easy to read.
function ProductCard({ product, onCardClick }) {
  return (
    <div
      className="sld-card flex flex-col w-full"
      onClick={() => onCardClick(product.id)}
      style={{ cursor: "pointer" }}
    >
      {/* Image wrapper handles the hover image-swap + discount badge */}
      <div className="sld-img-wrap relative w-full">
        {/* Discount badge, top-left corner, only shown if a discount exists */}
        {product.discount && (
          <span className="sld-badge absolute">{product.discount}</span>
        )}

        <img
          className="sld-img sld-img-default w-full h-full"
          src={product.image}
          alt={product.name}
        />
        <img
          className="sld-img sld-img-hover w-full h-full"
          src={product.hoverImage}
          alt={product.name}
        />

        {/* Plus button, only visible on hover (see CSS) */}
        <button
          className="sld-plus-btn absolute"
          aria-label="Quick add"
          onClick={(e) => e.stopPropagation()}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Text info below the image */}
      <div className="sld-info flex flex-col">
        <p className="sld-name">{product.name}</p>
        <div className="sld-price-row flex items-center">
          {product.oldPrice && (
            <span className="sld-old-price">{product.oldPrice}</span>
          )}
          <span
            className={product.oldPrice ? "sld-price sld-price-off" : "sld-price"}
          >
            {product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function SolidsCollection() {
  // Refs so our custom arrow buttons can control the Swiper slider
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  // Sirf "solids" collection ke products — filter ab server par hota hai.
  const {
    products: solidProducts,
    loading,
    error,
    retry,
  } = useProducts({ collection: "solids", page_size: 96 });

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="sld-section w-full">
      <div className="sld-container w-full max-w-screen-2xl mx-auto px-4">
        {/* Header row: title on the left, "view all" + arrows on the right */}
        <div className="sld-header flex items-center justify-between flex-wrap gap-4">
          <h2 className="sld-title">
            Our <span className="sld-title-italic">Solids</span> Collection
          </h2>

          <div className="sld-header-right flex items-center gap-6">
            
              <a
              href="#"
              className="view-all-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/collection/solids");
              }}
            >
              VIEW ALL
            </a>

            <div className="sld-arrows flex items-center gap-2">
              <button ref={prevRef} className="sld-arrow-btn" aria-label="Previous">
                <ArrowLeftIcon />
              </button>
              <button ref={nextRef} className="sld-arrow-btn" aria-label="Next">
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper slider showing all product cards */}
        {error ? (
          <ErrorState onRetry={retry} />
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={4}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 0 },
              640: { slidesPerView: 2, spaceBetween: 0 },
              1024: { slidesPerView: 3, spaceBetween: 0 },
              1280: { slidesPerView: 4, spaceBetween: 0 },
            }}
            className="sld-swiper"
            // Skeleton se asli slides par jaate waqt Swiper ko dobara
            // init karwata hai, warna slide count aur arrows stale reh sakte hain.
            key={loading ? "loading" : "loaded"}
          >
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <CardSkeleton />
                  </SwiperSlide>
                ))
              : solidProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} onCardClick={handleCardClick} />
                  </SwiperSlide>
                ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}