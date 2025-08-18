import { Link } from "react-router-dom";
import formatCurrency from "../../../../Utils/FormatCurrency";
import ProductImageCarousel from "./ProductImageCarousel";

const Product = ({ product }) => {
  return (
    <div className="small-product">
      <div className="small-product-image-container">
        {product.ProductDiscount && (
          <div className="product-discount-ribbon">
            Buy {product.ProductDiscount.qty}+ & Save ₹
            {product.ProductDiscount.pricetobereduced}
          </div>
        )}
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
            <div className="product-card-name">{product.name}</div>
            <span className="small-product-price">
              {formatCurrency(product?.price)}
            </span>
          </div>
        </Link>
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

        {product.rating > 0 && (
          <div className="product-rating-badge">
            {" "}
            {product.rating != null
              ? Number.isInteger(Number(product.rating))
                ? Number(product.rating)
                : Number(product.rating).toFixed(2)
              : "-"}{" "}
            ★
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
