import { Link } from "react-router-dom";
import HeartIcon from "../../../HeartIcon";
import getImage from "../../../../Utils/GetImage";

const SmallProduct = ({ product }) => {
  return (
    <div className="small-product">
      <div className="small-product-image-container">
        <img
          src={getImage(product?.image)}
          alt={product.name}
          className="small-product-image"
        />
        <div className="heart-icon">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="small-product-details">
        <Link to={`/product/${product.id}`} className="small-product-link">
          <h2 className="small-product-title">
            <div>{product.name}</div>
            <span className="small-product-price">
              {" "}
              {product?.price?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
