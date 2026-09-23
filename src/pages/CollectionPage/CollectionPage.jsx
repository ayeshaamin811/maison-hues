import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  GridSkeleton,
  ErrorState,
} from "../../components/ProductStates/ProductStates";
import useProducts from "../../hooks/useProducts";

import "./CollectionPage.css";


const categoryTitles = {
  casual: { prefix: "Our", italic: "Casual", suffix: "Collections" },
  solids: { prefix: "Our", italic: "Solids", suffix: "Collection" },
  unstitched: { prefix: "Our", italic: "Unstitched", suffix: "Collection" },
  west: { prefix: "Our", italic: "West", suffix: "Collection" },
  formals: { prefix: "Our", italic: "Formals", suffix: "Collection" },
  embroidered: { prefix: "Our", italic: "Embroidered", suffix: "Collection" },
  "best-sellers": { prefix: "", italic: "Best Sellers", suffix: "" },

    // Main Menu wale add karo:
  "new-arrivals": { prefix: "Our", italic: "New In", suffix: "Collection" },
  "formal-edit": { prefix: "Our", italic: "Formal Edit", suffix: "" },
  "co-ordsets": { prefix: "Our", italic: "Co-Ord Sets", suffix: "" },
  "fusion-edit": { prefix: "Our", italic: "Fusion Edit", suffix: "" },
};
function CollectionPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // Sirf usi category ke products maangna jo URL mein aayi hai.
  // ?category= server par collection / edit / fabric teenon se match karta hai,
  // yani wahi kaam jo pehle product.category.includes() kar raha tha.
  const query =
    categoryName === "best-sellers"
      ? { is_best_seller: true, page_size: 96 }
      : { category: categoryName, page_size: 96 };

  const {
    products: filteredProducts,
    loading,
    error,
    retry,
  } = useProducts(query);

  // Agar mapping mein title na mile (unknown category), fallback title.
  const titleParts = categoryTitles[categoryName] || {
    prefix: "",
    italic: "Collection",
    suffix: "",
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="collection-page">
        <h1 className="collection-page-title">
          {titleParts.prefix}{" "}
          <span className="collection-page-title-italic">
            {titleParts.italic}
          </span>{" "}
          {titleParts.suffix}
        </h1>

        {loading ? (
          <GridSkeleton className="collection-page-grid" count={8} />
        ) : error ? (
          <ErrorState onRetry={retry} />
        ) : filteredProducts.length === 0 ? (
          <p className="collection-page-empty">No products found.</p>
        ) : (
          <div className="collection-page-grid">
            {filteredProducts.map((product) => (
              <div
                className="collection-page-card"
                key={product.id}
                onClick={() => handleCardClick(product.id)}
              >
                <div className="collection-page-img-wrap">
                  <img
                    className="collection-page-img collection-page-img-default"
                    src={product.image}
                    alt={product.name}
                  />
                  <img
                    className="collection-page-img collection-page-img-hover"
                    src={product.hoverImage}
                    alt={product.name}
                  />
                </div>
                <p className="collection-page-name">{product.name}</p>
                <p className="collection-page-price">{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default CollectionPage;