import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getImage from "../../../Utils/GetImage";
import formatCurrency from "../../../Utils/FormatCurrency";
import formatDate from "../../../Utils/FormatDate";
import formatTime from "../../../Utils/FormatTime";

const ProductCard = ({ product }) => {
  console.log("prrrrrrrrrrrrr", product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (isHovered && product.ProductImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          (prev) => (prev + 1) % product.ProductImages.length
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHovered, product.ProductImages.length]);

  const getDisplayImage = () => {
    if (product.ProductImages.length > 0) {
      return product.ProductImages[currentImageIndex].image_url;
    }
  };

  return (
    <div className="product-item">
      <div className="product-card-alt">
        <section
          className="product-card-image-section"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link
            to={`/admin/product/update/${product.id}`}
            className="product-card-link"
          >
            <section className={`product-card-image-section `}>
              <img
                className="product-card-image"
                src={getDisplayImage()}
                alt={product.name}
              />
            </section>
            {product.ProductImages.length > 1 && (
              <div className="image-indicator">
                {product.ProductImages.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator-dot ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </Link>
        </section>

        <div className="product-card-body">
          <div className="product-brand-badge-holder">
            {product.rating > 0 && (
              <div className="product-rating-badge">
                {Number.isInteger(product.rating) ? product.rating : product.rating.toFixed(2)} ★
              </div>
            )}
            <div className="product-brand-name-holder">
              <div className="product-brand-badges">{product?.brand}</div>
            </div>
          </div>  
          <div className="product-card-header">
            <p className="product-card-names">{product?.name}</p>
            <p className="product-card-price">
              {formatCurrency(product?.price)}
            </p>
          </div>
          <p className="product-card-meta">
            {formatDate(product?.updatedAt)} {formatTime(product?.updatedAt)}
          </p>
          <p className="product-card-description">
            {product?.description?.substring(0, 60)}...
          </p>
          <div className="btn">
            <Link
              to={`/admin/product/update/${product.id}`}
              className="btn-customized"
            >
              Update Product
            </Link>
          </div>
          <div className="btn">
            <Link
              to={`/admin/product/view/${product.id}`}
              className="btn-customized"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
