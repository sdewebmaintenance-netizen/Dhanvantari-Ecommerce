import React, { useState, useEffect } from "react";
import getImage from "../../../../Utils/GetImage";

const ProductImageCarousel = ({
  images = [],
  autoRotate = true,
  rotationInterval = 1000,
  showIndicators = true,
  className = "",
  indicatorClassName = "",
  activeIndicatorClassName = "",
  onImageClick,
  imageclass="product-card-image",
}) => {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (hovered && autoRotate && images?.length > 1) {
      interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, rotationInterval);
    }
    return () => clearInterval(interval);
  }, [hovered, images, autoRotate, rotationInterval]);

  const displayImage = images[imageIndex]?.image_url

  return (
    <section
      className={`product-card-image-section ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className={imageclass}
        src={displayImage}
        alt={"Product image"}
        onClick={onImageClick}
      />

      {showIndicators && images?.length > 1 && (
        <div className="image-indicator">
          {images.map((_, index) => (
            <span
              key={index}
              className={`indicator-dot ${indicatorClassName} ${
                index === imageIndex ? `active ${activeIndicatorClassName}` : ""
              }`}
              onClick={() => setImageIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductImageCarousel; 