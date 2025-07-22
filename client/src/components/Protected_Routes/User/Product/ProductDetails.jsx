import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

  const { data: userInfo } = useGetUserInfoQuery();

  useEffect(() => {
    if (product?.ProductDiscount && product?.price) {
      const selectedQty = parseInt(qty);

      if (selectedQty >= product.ProductDiscount.qty) {
        setAppliedDiscount(product.ProductDiscount);
        setDiscountedPrice(
          product.price - product.ProductDiscount.pricetobereduced
        );
      } else {
        setAppliedDiscount(null);
        setDiscountedPrice(null);
      }
    }

    if (product?.moq && qty < product.moq) {
      setQty(product.moq);
    }
  }, [qty, product?.ProductDiscount, product?.price, product?.moq]);

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
      alert("Review created successfully");
    } catch (error) {
      alert(error?.data.error || error.message);
    }
  };

  const addToCartHandler = async (e) => {
    e.preventDefault();
    if (!qty) {
      alert("Quantity is required");
      return;
    }

    try {
      await createCart({
        product_id: product.id,
        quantity: parseInt(qty),
      }).unwrap();

      alert("Item added to cart successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.error || "Adding to cart failed, try again.");
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
                        Save{" "}
                        {formatCurrency(
                          product.ProductDiscount.pricetobereduced
                        )}
                        (Buy {product.ProductDiscount.qty}+)
                      </div>
                    </>
                  ) : (
                    formatCurrency(product?.price)
                  )}
                </p>
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

                <div className="stat-group">
                  {product.SGST && (
                    <p className="stat-item">SGST: {product.SGST}%</p>
                  )}
                  {product.CGST && (
                    <p className="stat-item">CGST: {product.CGST}%</p>
                  )}
                  {product.IGST && (
                    <p className="stat-item">IGST: {product.IGST}%</p>
                  )}
                  {product.moq && (
                    <p className="stat-item">Minimum Order: {product.moq}</p>
                  )}
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
                      {[...Array(product.countInStock).keys()]
                        .map((x) => x + 1)
                        .filter((x) => (product.moq ? x >= product.moq : true))
                        .map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                    </select>
                    {product.moq && qty < product.moq && (
                      <p className="text-danger small">
                        Minimum order quantity is {product.moq}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={addToCartHandler}
                  disabled={
                    product.countInStock === 0 ||
                    (product.moq && qty < product.moq)
                  }
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
