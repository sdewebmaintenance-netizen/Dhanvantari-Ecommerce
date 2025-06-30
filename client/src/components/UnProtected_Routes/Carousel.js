import React, { useEffect } from "react";
import Tapiacpo_Starch from "../../assets/images/Website-bg/Tapiaco_Starch.jpeg";
import Sago_Starch from "../../assets/images/Website-bg/Sago_Starch_1.jpeg";
import Corn_Starch from "../../assets/images/Website-bg/Corn_Starch.jpg";
import Native_Potato_Starch from "../../assets/images/Website-bg/Potato_Starchs.jpeg";
import Trade_Needs from "../../assets/images/Website-bg/Trade_Needs.jpg";

const Carousel = () => {
  const slides = [
    {
      id: 1,
      bgImage: `url(${Trade_Needs})`,
      title: "Reliable Food ingredients supplier ",
      subtitle:
        "Bring absolute transparency and visibility to customers with quality and on time delivery.",
    },
    {
      id: 2,
      bgImage: `url(${Corn_Starch})`,
      title: "Corn Starch Powder",
      subtitle:
        "Multi-purpose corn starch used in food processing and packaging",
    },
    {
      id: 3,
      bgImage: `url(${Sago_Starch})`,
      title: "Sago Broken Flour",
      subtitle:
        "Crushed sago flour suitable for snacks, adhesives, and textiles",
    },
    {
      id: 5,
      bgImage: `url(${Native_Potato_Starch})`,
      title: "Native Potato Starch",
      subtitle:
        "Natural potato starch with high viscosity for food and pharma uses",
    },
    {
      id: 6,
      bgImage: `url(${Tapiacpo_Starch})`,
      title: "Tapioca Starch - Top Selling Product",
      subtitle:
        "Refined tapioca starch ideal for food, textile, and paper industries", 
    },
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
          style={{ backgroundImage: slide.bgImage }}
        >
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      <button className="carousel-btn prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        &#10095;
      </button>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
