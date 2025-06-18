import { Link } from "react-router-dom";
import getImage from "../../../../Utils/GetImage";
import formatCurrency from "../../../../Utils/FormatCurrency";

const Product = ({ product }) => {
  return (
    <div className="small-product">
      <div className="small-product-image-container">
        <img
          src={getImage(product?.image, "ProductImage")}
          alt={product.name}
          className="small-product-image"
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
