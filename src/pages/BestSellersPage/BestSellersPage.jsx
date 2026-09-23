import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  GridSkeleton,
  ErrorState,
} from "../../components/ProductStates/ProductStates";
import useProducts from "../../hooks/useProducts";

import "./BestSellersPage.css";

function BestSellersPage() {
  const navigate = useNavigate();

  // Sirf wo products jinki isBestSeller flag true hai — ab server filter karta hai.
  const {
    products: bestSellerProducts,
    loading,
    error,
    retry,
  } = useProducts({ is_best_seller: true, page_size: 96 });

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="best-sellers-page">
        <h1 className="best-sellers-page-title">
          Best <span className="best-sellers-page-title-italic">Sellers</span>
        </h1>

        {loading ? (
          <GridSkeleton className="best-sellers-page-grid" count={8} />
        ) : error ? (
          <ErrorState onRetry={retry} />
        ) : bestSellerProducts.length === 0 ? (
          <p className="best-sellers-page-empty">No products found.</p>
        ) : (
          <div className="best-sellers-page-grid">
            {bestSellerProducts.map((product) => (
              <div
                className="best-sellers-page-card"
                key={product.id}
                onClick={() => handleCardClick(product.id)}
              >
                <div className="best-sellers-page-img-wrap">
                  <img
                    className="best-sellers-page-img best-sellers-page-img-default"
                    src={product.image}
                    alt={product.name}
                  />
                  <img
                    className="best-sellers-page-img best-sellers-page-img-hover"
                    src={product.hoverImage}
                    alt={product.name}
                  />
                </div>
                <p className="best-sellers-page-name">{product.name}</p>
                <p className="best-sellers-page-price">{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default BestSellersPage;