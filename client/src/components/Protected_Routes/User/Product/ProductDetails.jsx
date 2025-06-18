import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../../../redux/api/productApiSlice";
import Loader from "../../../Common/Loader";
import Message from "../../../Common/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../../../redux/features/cart/cartSlice";
import getImage from "../../../../Utils/GetImage";
import { useGetUserInfoQuery } from "../../../../redux/api/usersApiSlice";
import formatCurrency from "../../../../Utils/FormatCurrency";

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

  const { data: userInfo } = useGetUserInfoQuery();

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
        <Link to="/shop" className="btn-customized">
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
                src={getImage(product.image, "ProductImage")}
                alt={product.name}
                className="product-main-image"
              />
            </div>
  
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <p className="product-details-price">
                {" "}
                {formatCurrency(product?.price)}
              </p>

              <div className="product-stats">
                <div className="stat-group">
                  <p className="stat-item">
                    <FaStore className="stats-icon" /> Brand: {product.brand}
                  </p>
                  <p className="stat-item">
                    <FaClock className="stats-icon" /> Added:{" "}
                    {moment(product.createAt).fromNow()}
                  </p>
                  <p className="stat-item">
                    <FaStar className="stats-icon" /> Reviews:{" "}
                    {product.numReviews}
                  </p>
                </div>

                <div className="stat-group">
                  <p className="stat-item">
                    <FaStar className="stats-icon" /> Ratings: {rating}
                  </p>
                  <p className="stat-item">
                    <FaShoppingCart className="stats-icon" /> Quantity:{" "}
                    {product.quantity}
                  </p>
                  <p className="stat-item">
                    <FaBox className="stats-icon" /> In Stock:{" "}
                    {product.countInStock}
                  </p>
                </div>
              </div>

              <div className="product-details-actions">
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

              <div>
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="btn-customized"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

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
        </>
      )}
    </>
  );
};

export default ProductDetails;
