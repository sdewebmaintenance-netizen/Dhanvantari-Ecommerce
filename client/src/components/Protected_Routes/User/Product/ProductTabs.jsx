import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../../../redux/api/productApiSlice";
import SmallProduct from "../../../../components/Protected_Routes/User/Home/SmallProduct";
import Loader from "../../..//Common/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div >
      <section className="product-tabs-nav">
        <div
          className={`product-tab ${activeTab === 1 ? "active-tab" : ""}`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`product-tab ${activeTab === 2 ? "active-tab" : ""}`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`product-tab ${activeTab === 3 ? "active-tab" : ""}`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      <section >
        {activeTab === 1 && (
          <div>
            {userInfo ? (
              <form onSubmit={submitHandler} >
                <div className="form-group">
                  <label htmlFor="rating" className="form-label">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="comment" className="form-label">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-control"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="btn-customized"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="sign-in-prompt">
                Please <Link to="/login" className="sign-in-link">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}
 
        {activeTab === 2 && (
          <div className="reviews-container">
            <div>{product.reviews.length === 0 && <p className="no-reviews">Tried it? Loved it? Tell us what you think!</p>}</div>

            <div className="reviews-list">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="review-item"
                >
                  <div className="review-header">
                    <strong className="review-author">{review.name}</strong>
                    <p className="review-date">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            {!data ? (
              <Loader />
            ) : (
              <div className="products-grid">
                {data.map((product) => (
                    <SmallProduct product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;