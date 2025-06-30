import { Link } from "react-router-dom";
import formatCurrency from "../../../../Utils/FormatCurrency";
import ProductImageCarousel from "./ProductImageCarousel";

const Product = ({ product }) => {
  return (
    <div className="small-product">
      <div className="small-product-image-container">
         <ProductImageCarousel
          images={product.ProductImages}
          imageClassName="product-card-image"
          indicatorClassName="product-indicator-dot"
          activeIndicatorClassName="product-indicator-active"
        />
      </div>

      <div className="small-product-details">
        <Link to={`/product/${product.id}`} className="small-product-link">
          <div className="small-product-title">
            <div>{product.name}</div>
            <span className="small-product-price">
              {formatCurrency(product?.price)}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;
