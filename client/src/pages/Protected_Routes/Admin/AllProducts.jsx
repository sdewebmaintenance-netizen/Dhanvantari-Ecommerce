import { Link } from "react-router-dom";
import { useAllProductsQuery } from "../../../redux/api/productApiSlice";
import getImage from "../../../Utils/GetImage";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import formatDate from "../../../Utils/FormatDate";
import formatTime from "../../../Utils/FormatTime";
import formatCurrency from "../../../Utils/FormatCurrency";

const AllProducts = () => {
  const { data: products, isLoading, error } = useAllProductsQuery();

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
                  <div className="product-item">
                    <div className="product-card-alt">
                      <section className="product-card-image-section">
                        <span className="product-brand-badge">
                          {product?.brand}
                        </span>
                        <Link
                          key={product.id}
                          to={`/admin/product/update/${product.id}`}
                        >
                          <img
                            className="product-card-image"
                            src={getImage(product.image)}
                            alt={product.name}
                          />
                        </Link>
                      </section>

                      <div className="product-card-body">
                        <div className="product-card-header">
                          <p className="product-card-name">{product?.name}</p>
                          <p className="product-card-price">
                            {formatCurrency(product?.price)}
                          </p>
                        </div>
                        <p className="product-card-price">
                          {formatDate(product?.createdAt)}{" "}
                          {formatTime(product?.createdAt)}
                        </p>

                        <p className="product-card-description">
                          {product?.description?.substring(0, 60)} ...
                        </p>

                        <div className="flex justify-between">
                          <Link
                            to={`/admin/product/update/${product.id}`}
                            className="btn-customized"
                          >
                            Update Product
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
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
