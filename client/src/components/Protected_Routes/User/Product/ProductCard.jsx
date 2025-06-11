import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import getImage from "../../../../Utils/GetImage";
import formatCurrency from "../../../../Utils/FormatCurrency";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully")
  };

  return (
    <div className="product-card-alt">
      <section className="product-card-image-section">
        <Link to={`/product/${p.id}`} className="product-card-link">
          <span className="product-brand-badge">{p?.brand}</span>
          <img
            className="product-card-image"
            src={getImage(p.image)}
            alt={p.name}
          />
        </Link>
      </section>

      <div className="product-card-body">
        <div className="product-card-header">
          <p className="product-card-name">{p?.name}</p>
          <p className="product-card-price">
            {formatCurrency(p?.price)}
           
          </p>
        </div>

        <p className="product-card-description">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="product-card-actions">
          <Link to={`/product/${p.id}`} className="btn-customized" style={{padding:"0.5rem"}}>
            Read More
            <svg
              className="read-more-icon"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="add-to-cart-btn"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
