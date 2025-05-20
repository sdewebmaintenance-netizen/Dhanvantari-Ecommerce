import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "../../components/HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import getImage from "../../Utils/GetImage";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link to="/home" className="btn-customized">
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="product-details-content">
            <div className="product-image-wrapper">
              <img
                src={getImage(product.image)}
                alt={product.name}
                className="product-main-image"
              />
              <HeartIcon product={product} />
            </div>

            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">
                {product.description}
              </p>

              <p className="product-price">$ {product.price}</p>

              <div className="product-stats">
                <div className="stat-group">
                  <h1 className="stat-item">
                    <FaStore className="stat-icon" /> Brand: {product.brand}
                  </h1>
                  <h1 className="stat-item">
                    <FaClock className="stat-icon" /> Added:{" "}
                    {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="stat-item">
                    <FaStar className="stat-icon" /> Reviews: {product.numReviews}
                  </h1>
                </div>

                <div className="stat-group">
                  <h1 className="stat-item">
                    <FaStar className="stat-icon" /> Ratings: {rating}
                  </h1>
                  <h1 className="stat-item">
                    <FaShoppingCart className="stat-icon" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="stat-item">
                    <FaBox className="stat-icon" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="product-actions">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div className="quantity-selector">
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="quantity-select"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

             {/*  <div>
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="add-to-cart-btn"
                >
                  Add To Cart
                </button>
              </div> */}
            </div>
            
          </div>

          {/* <div className="product-tabs-container">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div> */}
        </>
      )}
    </>
  );
};

export default ProductDetails;