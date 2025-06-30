import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../../../redux/api/productApiSlice";
import Loader from "../../../Common/Loader";
import Message from "../../../Common/Message";
import { FaBox, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { useGetUserInfoQuery } from "../../../../redux/api/usersApiSlice";
import formatCurrency from "../../../../Utils/FormatCurrency";
import { useCreateCartMutation } from "../../../../redux/api/cartApiSlice";
import ProductImageCarousel from "./ProductImageCarousel";
import { useFetchDiscountsQuery } from "../../../../redux/api/discountApiSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { data: discounts } = useFetchDiscountsQuery();
  console.log("discounts", discounts);

  const { data: userInfo } = useGetUserInfoQuery();

  useEffect(() => {
    if (discounts && discounts.length > 0) {
      const selectedQty = parseInt(qty);
      const applicableDiscount = discounts.find(
        (discount) => selectedQty >= discount.qty
      );

      if (applicableDiscount) {
        setAppliedDiscount(applicableDiscount);
        setDiscountedPrice(product.price - applicableDiscount.pricetobereduced);
      } else {
        setAppliedDiscount(null);
        setDiscountedPrice(null);
      }
    }
  }, [qty, discounts, product?.price]);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [createCart] = useCreateCartMutation();

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

  const addToCartHandler = async (e) => {
    e.preventDefault();
    if (!qty) {
      toast.error("Quantity is required");
      return;
    }

    try {
      await createCart({
        product_id: product.id,
        quantity: parseInt(qty),
      }).unwrap();

      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Adding to cart failed, try again.");
    }
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
              <ProductImageCarousel
                imageclass="detailImage"
                images={product.ProductImages}
                indicatorClassName="product-indicator-dot"
                activeIndicatorClassName="product-indicator-active"
              />
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <p className="product-details-price">
                {discountedPrice ? (
                  <>
                    <span
                      className="original-price"
                      style={{ textDecoration: "line-through" }}
                    >
                      {formatCurrency(product?.price)}
                    </span>
                    <span
                      className="discounted-price"
                      style={{ color: "red", marginLeft: "10px" }}
                    >
                      {formatCurrency(discountedPrice)}
                    </span>
                    <div className="discount-badge">
                      Save {formatCurrency(appliedDiscount.pricetobereduced)}{" "}
                      (Buy {appliedDiscount.qty}+)
                    </div>
                  </>
                ) : (
                  formatCurrency(product?.price)
                )}
              </p>

              <div className="product-stats">
                <div className="stat-group">
                  <p className="stat-item">
                    <FaStore className="stats-icon" /> Brand: {product.brand}
                  </p>
                  <p className="stat-item">
                    <FaShoppingCart className="stats-icon" /> Weight:{" "}
                    {product.weight}
                  </p>
                  <p className="stat-item">
                    <FaBox className="stats-icon" /> In Stock:{" "}
                    {product.countInStock}
                  </p>
                </div>

                <div className="stat-group">
                  <p className="stat-item">
                    <FaStar className="stats-icon" /> Reviews:{" "}
                    {product.numReviews}
                  </p>
                  <p className="stat-item">
                    <FaStar className="stats-icon" /> Ratings: {rating}
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
