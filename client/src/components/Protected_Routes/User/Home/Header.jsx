import { useGetTopProductsQuery } from "../../../../redux/api/productApiSlice";
import Loader from "../../../Common/Loader";
import SmallProduct from "../../User/Home/SmallProduct";
import ProductCarousel from "../../User/Home/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="header-container">
        <div className="small-products-container">
          <div className="small-products-grid">
            {data.map((product) => (
              <div key={product.id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;