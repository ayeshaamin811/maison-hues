import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
// Swiper components + styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Product data (static file se aa raha hai)
import products from "../../data/products";

// Our own custom CSS (colors, fonts, hover effects, media queries)
import "./Casualcollections.css";

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

// One product card. Keeping this as its own small component
// keeps the main component easy to read.
function ProductCard({ product, onCardClick }) {
  return (
    <div
      className="product-card flex flex-col w-full"
      onClick={() => onCardClick(product.id)}
      style={{ cursor: "pointer" }}
    >
      {/* Image wrapper handles the hover image-swap + plus icon */}
      <div className="product-image-wrapper relative w-full">
        <img
          className="product-image product-image-default w-full h-full"
          src={product.image}
          alt={product.name}
        />
        <img
          className="product-image product-image-hover w-full h-full"
          src={product.hoverImage}
          alt={product.name}
        />

        {/* Plus button, only visible on hover (see CSS) */}
        <button
          className="plus-button absolute"
          aria-label="Quick add"
          onClick={(e) => e.stopPropagation()}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Text info below the image */}
      <div className="product-info flex flex-col">
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price}</p>
      </div>
    </div>
  );
}

// Main component
export default function CasualCollections() {
  // Refs so our custom arrow buttons can control the Swiper slider
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  // Static data se sirf "casual" collection ke products.
  const casualProducts = products.filter((p) =>
    Array.isArray(p.category) && p.category.includes("casual")
  );

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="casual-collections w-full">
      <div className="casual-container w-full max-w-screen-2xl mx-auto px-4">
        {/* Header row: title on the left, "view all" + arrows on the right */}
        <div className="casual-header flex items-center justify-between flex-wrap gap-4">
          <h2 className="casual-title">
            Our <span className="casual-title-italic">Casual</span> Collections
          </h2>

          <div className="casual-header-right flex items-center gap-6">
            <a
            href="#"
            className="view-all-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/collection/casual");
            }}
          >
            VIEW ALL
          </a>

            <div className="casual-arrows flex items-center gap-2">
              <button ref={prevRef} className="arrow-button" aria-label="Previous">
                <ArrowLeftIcon />
              </button>
              <button ref={nextRef} className="arrow-button" aria-label="Next">
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper slider showing all product cards */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
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
            0: { slidesPerView: 1, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 18 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="casual-swiper"
        >
          {casualProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} onCardClick={handleCardClick} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}