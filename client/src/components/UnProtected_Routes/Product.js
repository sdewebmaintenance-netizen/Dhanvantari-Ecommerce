import React, { useState } from "react";
import handleGoogleSignIn from "../../Utils/HandleGoogleSignIn";
import HowItWorks from "./HowItWorks";

const Product = () => {
  const allProducts = [
    {
      id: 1,
      name: "Tapioca Starch",
      weight: "50 KGS",
      description:
        "High-quality tapioca starch suitable for various industrial and food applications.",
    },
    {
      id: 2,
      name: "Tapioca Starch",
      weight: "30 KGS",
      description:
        "Fine-grade tapioca starch ideal for cooking, baking, and industrial use.",
    },
    {
      id: 3,
      name: "Tapioca Thippu Flour",
      weight: "50 KGS",
      description:
        "Derived from tapioca residue, used in animal feed and secondary starch applications.",
    },
    {
      id: 4,
      name: "Tapioca Thippi Flour",
      weight: "30 KGS",
      description:
        "Processed flour from tapioca waste, economical choice for bulk use.",
    },
    {
      id: 5,
      name: "Sago Broken Flour",
      weight: "50 KGS",
      description:
        "Coarse flour made from broken sago pearls, commonly used in snacks and mixes.",
    },
    {
      id: 6,
      name: "Sago Broken Flour",
      weight: "30 KGS",
      description:
        "Lightweight sago broken flour ideal for economical bulk requirements.",
    },
    {
      id: 7,
      name: "Corn Starch Powder",
      weight: "50 KGS",
      description:
        "Refined corn starch with smooth texture, excellent for food and pharma applications.",
    },
    {
      id: 8,
      name: "Native Potato Starch",
      weight: "50 KGS",
      description:
        "Natural potato starch ideal for thickening and binding in food production.",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(3);

  const showMore = () => {
    setVisibleCount(allProducts.length);
  };

  const showLess = () => {
    setVisibleCount(3);
  };

  return (
    <>
    <HowItWorks />
      <h2 className="title text-animation ">Our Products</h2>
      <div className="product-list-container">
        <div className="product-list-main">
          <div className="products-grid">
            {allProducts.slice(0, visibleCount).map((product) => (
              <div key={product.id} className="product-card">
                <h2 className="product-name">
                  {product.name}
                  <span className="product-weight-badge">{product.weight}</span>
                </h2>
                <div className="product-description">{product.description}</div>
              </div>
            ))}
            <div className="view-more-container">
              {visibleCount < allProducts.length ? (
                <button className="btn-customized" onClick={showMore}>
                  + View All {allProducts.length} Products
                </button>
              ) : (
                <button className="btn-customized" onClick={showLess}>
                  - Show Less
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="vertical-divider"></div>
        <div className="cta-section">
          <h4 className="text-animation">Interested in shopping with us?</h4>
          <button className="btn-customized" onClick={handleGoogleSignIn}>
            Sign In / Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Product;
