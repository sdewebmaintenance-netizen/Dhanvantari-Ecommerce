import { useEffect, useRef, useState } from "react";
import { useGetTopProductsQuery } from "../../../../redux/api/productApiSlice";
import Message from "../../../Message";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import getImage from "../../../../Utils/GetImage";

const ProductCarousel = () => {
  const { data: products = [], isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const totalSlides = products.length;

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [products]);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  const goToSlide = (index) => {
    stopAutoSlide();
    setCurrentIndex(index);
    startAutoSlide();
  };

  return (
    <div>
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div>
          <div className="carousel-container">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`carousel-slide ${
                  index === currentIndex ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${getImage(product.image)})` }}
              ></div>
            ))}

            <div className="carousel-dots">
              {products.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>

            <button
              className="carousel-btn prev"
              onClick={() =>
                goToSlide((currentIndex - 1 + totalSlides) % totalSlides)
              }
            >
              ‹
            </button>
            <button
              className="carousel-btn next"
              onClick={() => goToSlide((currentIndex + 1) % totalSlides)}
            >
              ›
            </button>
          </div>

          <div className="carousel-product-info">
            {products[currentIndex] && (
              <div className="product-info-card">
                <h2>{products[currentIndex].name}</h2>
                <p>
                  {" "}
                  {products[currentIndex].price?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </p>

                <p>
                  {products[currentIndex].description?.substring(0, 170)} ...
                </p>

                <div className="product-info-meta">
                  <div>
                    <p>
                      <FaStore /> Brand: {products[currentIndex].brand}
                    </p>
                    <p>
                      <FaClock /> Added:{" "}
                      {moment(products[currentIndex].createdAt).fromNow()}
                    </p>
                    <p>
                      <FaStar /> Reviews: {products[currentIndex].numReviews}
                    </p>
                  </div>
                  <div>
                    <p>
                      <FaStar /> Ratings:{" "}
                      {Math.round(products[currentIndex].rating)}
                    </p>
                    <p>
                      <FaShoppingCart /> Quantity:{" "}
                      {products[currentIndex].quantity}
                    </p>
                    <p>
                      <FaBox /> In Stock: {products[currentIndex].countInStock}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
