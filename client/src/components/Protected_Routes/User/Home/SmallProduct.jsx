import { Link } from "react-router-dom";
import formatCurrency from "../../../../Utils/FormatCurrency";
import ProductImageCarousel from "../Product/ProductImageCarousel";

const SmallProduct = ({ product }) => {
  const hasDiscount = product?.ProductDiscount;
  const hasRating = product?.rating > 0;

  return (
    <div className="small-product">
      <div className="small-product-image-container">
        {hasDiscount && (
          <div className="product-discount-ribbon">
            Buy {product.ProductDiscount.qty}+ & Save ₹
            {product.ProductDiscount.pricetobereduced}
          </div>
        )}
        <ProductImageCarousel
          images={product.ProductImages}
          imageclass="smallImage"
          indicatorClassName="product-indicator-dot"
          activeIndicatorClassName="product-indicator-active"
        />
      </div>

      <div className="small-product-details">
        <Link to={`/product/${product.id}`} className="small-product-link">
          <div className="small-product-title">
            <div className="product-card-name">{product.name}</div>
            <span className="small-product-price">
              {formatCurrency(product?.price)}
            </span>
          </div>

          <div className="pro-in">
            {product.IGST > 0 ? (
              <p className="product-gst">GST: {product.IGST}%</p>
            ) : product.CGST > 0 || product.SGST > 0 ? (
              <p className="product-gst">
                GST: {product.CGST + product.SGST}%
                {product.CGST > 0 && ` (CGST: ${product.CGST}%)`}
                {product.SGST > 0 && ` (SGST: ${product.SGST}%)`}
              </p>
            ) : null}

            {hasRating && (
              <p className="product-rating-badge">{product.rating} ★</p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
