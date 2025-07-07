import { useEffect } from "react";
import { Link } from "react-router-dom";
import {  useAllProductsAdminQuery } from "../../../redux/api/productApiSlice";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import ProductCard from "../../../components/Protected_Routes/Admin/ProductCard ";

const AllProducts = () => {
  const { data: products, isLoading, error, refetch } = useAllProductsAdminQuery();

   useEffect(() => {
    refetch();
  }, [refetch]);

  console.log("al products", products)

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="products-container">
            <h2 className="title text-animation">Product List</h2>

            <Link to="/admin/create-product" className="btn-customized">
              Create New Product
            </Link>
          </div>
          <div className="products-grid">
            {products.length === 0 ? (
              <Loader />
            ) : (
              <>
                {products.map((product) => (
                 <ProductCard key={product.id} product={product} />
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default AllProducts;
