import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import products from "../../data/products";

import "./BestSellersPage.css";

function BestSellersPage() {
  const navigate = useNavigate();

  // Static data se sirf wo products jinki isBestSeller flag true hai.
  const bestSellerProducts = products.filter((p) => p.isBestSeller === true);

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

        {bestSellerProducts.length === 0 ? (
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