import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="rating-container">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className="rating-star full-star" />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className="rating-star half-star" />}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className="rating-star empty-star" />
      ))}

      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Ratings;