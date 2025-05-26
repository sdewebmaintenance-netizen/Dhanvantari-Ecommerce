import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../../../redux/api/productApiSlice";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import Header from "../../../components/Protected_Routes/User/Home/Header";
import Product from "../../../components/Protected_Routes/User/Product/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="products-container">
            <h2 className="title text-animation">Special Products</h2>

            <Link to="/shop" className="btn-customized">
              Shop
            </Link>
          </div>

          <div className="special-products-container">
            <div className="special-products-grid">
              {data.products.map((product) => (
                <div key={product.id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
