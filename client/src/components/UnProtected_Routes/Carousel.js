import React, {useEffect} from 'react';
import Sago_Starch from "../../assets/images/Sago_Starch.png"
import Potato_Starch from "../../assets/images/Potato_Starch.png"
import Tapiacpo_Starch from "../../assets/images/Tapiaco_Starch.png"
import Maize_Starch from "../../assets/images/Maize_Starch.png"
import Trade_Needs from "../../assets/images/Trade_Needs.png"

const Carousel = () => {   
  const slides = [
    {
      id: 1,
      bgImage: `url(${Sago_Starch})`,
      title: 'Sago Starch Powder',
      subtitle: 'Premium quality sago starch for various industrial applications'
    },
    {
      id: 2,
      bgImage: `url(${Potato_Starch})`,
      title: 'Potato Starch Powder',
      subtitle: 'High-grade potato starch for food and non-food uses'
    },
    {
      id: 3,
      bgImage: `url(${Tapiacpo_Starch})`,
      title: 'Tapioca Flour',
      subtitle: 'Pure tapioca flour for culinary and industrial needs'
    },
    {
      id: 4,
      bgImage: `url(${Maize_Starch})`,
      title: 'Maize Starch Powder',
      subtitle: 'Versatile maize starch for diverse manufacturing requirements'
    },
    {
      id: 5,
      bgImage: `url(${Trade_Needs})`,
      title: 'Trade Consultation Service',
      subtitle: 'Expert guidance for your starch import/export needs'
    }
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
          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: slide.bgImage }}
        >
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      <button className="carousel-btn prev" onClick={prevSlide}>&#10094;</button>
      <button className="carousel-btn next" onClick={nextSlide}>&#10095;</button>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;