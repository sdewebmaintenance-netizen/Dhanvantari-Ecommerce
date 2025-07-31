import React, { useState, useEffect } from "react";
import formatCurrency from "../../Utils/FormatCurrency";
import formatDate from "../../Utils/FormatDate";
import formatTime from "../../Utils/FormatTime";
import getImage from "../../Utils/GetImage";
import { Link } from "react-router-dom";

const ProductDisplay = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (hovered && product.ProductImages?.length > 1) {
      interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % product.ProductImages.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hovered, product.ProductImages]);

  const displayImage = product.ProductImages?.length
    ? product.ProductImages[imageIndex]?.image_url
    : getImage("default-product.jpg", "ProductImage");

  return (
    <div className="product-item">
      <div className="product-card-alt">
        <section
          className="product-card-image-section"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="product-brand-badge">{product?.brand}</span>
          <img
            className="product-card-image"
            src={displayImage}
            alt={product.name}
          />
          {product.ProductImages?.length > 1 && (
            <div className="image-indicator">
              {product.ProductImages.map((_, index) => (
                <span
                  key={index}
                  className={`indicator-dot ${
                    index === imageIndex ? "active" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        <div className="product-card-body">
          <div className="product-card-header">
            <p className="product-card-name">{product?.name}</p>
            <p className="product-card-price">
              {formatCurrency(product?.price)}
            </p>
          </div>
          <p className="product-card-description">
            {product?.description?.substring(0, 60)}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
