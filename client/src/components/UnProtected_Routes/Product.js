import React, { useState } from "react";
import handleGoogleSignIn from "../../Utils/HandleGoogleSignIn";

const Product = () => {
  const allProducts = [
    {
      id: 1,
      name: "Sago Starch Powder",
      description:
        "High purity sago starch extracted from the pith of sago palm stems, ideal for food and industrial applications.",
    },
    {
      id: 2,
      name: "Potato Starch Powder",
      description:
        "Premium quality potato starch with excellent binding properties, perfect for food processing.",
    },
    {
      id: 3,
      name: "Tapioca Flour",
      description:
        "Finely ground tapioca flour, gluten-free alternative for baking and cooking needs.",
    },
    {
      id: 4,
      name: "Starch Powder",
      description:
        "Versatile starch powder suitable for various industrial applications including textiles and paper.",
    },
    {
      id: 5,
      name: "Maize Starch Powder",
      description:
        "High-quality maize starch with multiple uses in food and pharmaceutical industries.",
    },
    {
      id: 6,
      name: "Cassava Flour",
      description:
        "Nutritious cassava flour, a great wheat substitute for gluten-free recipes.",
    },
    {
      id: 7,
      name: "Export Documentation",
      description:
        "Comprehensive export documentation services for hassle-free international trade.",
    },
    {
      id: 8,
      name: "Trade Consultation",
      description:
        "Expert trade consultation to navigate global starch market dynamics.",
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
      <h2 className="title text-animation ">Our Products</h2>
      <div className="product-list-container">
        <div className="product-list-main">
          <div className="products-grid">
            {allProducts.slice(0, visibleCount).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-name">{product.name}</div>
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
