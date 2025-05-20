import React from "react";
import Products from "../components/UnProtected_Routes/Product";
import BusinessInfo from "../components/UnProtected_Routes/BusinessInfo";
import Carousel from "../components/UnProtected_Routes/Carousel"

const LandingPage = () => {
  return (
    <div>
      <div id="home">
      <Carousel />
      </div> 
      <div id="about">
        <BusinessInfo />
      </div>
      <div id="product">
        <Products />
      </div>
    </div>
  );
};


export default LandingPage;
