import React, { useState } from "react";
import handleGoogleSignIn from "../../Utils/HandleGoogleSignIn";
import HowItWorks from "./HowItWorks";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Common/Loader";
import Message from "../../components/Common/Message";
import ProductDisplay from "./ProductDisplay";
import { filterProductsByType } from "../../Utils/FilterProducts";

const Product = () => {
  const { data: products, isLoading, error } = useAllProductsQuery();
  const [visibleCount, setVisibleCount] = useState(3);

  const showMore = () => {
    setVisibleCount(products?.length || 0);
  };

  const showLess = () => {
    setVisibleCount(3);
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  const filteredProducts = filterProductsByType(products, "wholesale");

  return (
    <>
      <HowItWorks />
      <h2 className="title text-animation">Our Products</h2>
      <div className="product-list-container">
        <div className="product-list-main">
          <div className="products-grid">
            {filteredProducts?.slice(0, visibleCount).map((product) => (
              <ProductDisplay key={product.id} product={product} />
            ))}
            <div className="view-more-container">
              {visibleCount < filteredProducts?.length ? (
                <button className="btn-customized" onClick={showMore}>
                  + View All {filteredProducts?.length} Products
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
