import BusinessInfo from "../../components/UnProtected_Routes/BusinessInfo";
import Carousel from "../../components/UnProtected_Routes/Carousel"

const LandingPage = () => {
  return (
    <div>
      <div>
      <Carousel />
      </div> 
      <div >
        <BusinessInfo />
      </div>
    </div>
  );
};


export default LandingPage;