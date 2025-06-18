import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getImage from "../../../Utils/GetImage";
import formatCurrency from "../../../Utils/FormatCurrency";
import formatDate from "../../../Utils/FormatDate";
import formatTime from "../../../Utils/FormatTime";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (isHovered && product.ProductImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => 
          (prev + 1) % product.ProductImages.length
        );
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isHovered, product.ProductImages.length]);

  const getDisplayImage = () => {
    if (product.ProductImages.length > 0) {
      return getImage(
        product.ProductImages[currentImageIndex].image_name, 
        "ProductImage"
      );
    }
    return getImage(product.image || "default-product.jpg", "ProductImage");
  };

  return (
    <div className="product-item">
      <div className="product-card-alt">
        <section 
          className="product-card-image-section"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="product-brand-badge">
            {product?.brand}
          </span>
          <Link to={`/admin/product/update/${product.id}`}>
            <img
              className="product-card-image"
              src={getDisplayImage()}
              alt={product.name}
            />
          </Link>
          
          {product.ProductImages.length > 1 && (
            <div className="image-indicator">
              {product.ProductImages.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
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
          <p className="product-card-meta">
            {formatDate(product?.createdAt)} {formatTime(product?.createdAt)}
          </p>
          <p className="product-card-description">
            {product?.description?.substring(0, 60)}...
          </p>
          <div className="flex justify-between">
            <Link
              to={`/admin/product/update/${product.id}`}
              className="btn-customized"
            >
              Update Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;