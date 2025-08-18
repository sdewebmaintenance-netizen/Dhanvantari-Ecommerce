import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/api/productApiSlice";
import { Country } from "country-state-city";
import { AiFillStar } from "react-icons/ai";
import formatCurrency from "../../../Utils/FormatCurrency";
import Loader from "../../Common/Loader";

const ProductView = () => {
  const params = useParams();
  const { data: productData, refetch } = useGetProductByIdQuery(params.id);

  useEffect(() => {
    refetch();
  }, [params.id, refetch]);

  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((c) => ({
      name: c.name,
      isoCode: c.isoCode,
    }));
    setCountryOptions(countries);
  }, []);

  if (!productData) {
    return <Loader />;
  }

  const getCountryName = (countryName) => {
    const country = countryOptions.find((c) => c.name === countryName);
    return country ? country.name : countryName;
  };

  return (
    <div className="product-view-container">
      <h1 className="title">{productData.name}</h1>

      <div className="product-view-content">
        <div className="product-images-section">
          <div className="image-preview-grid">
            {productData.ProductImages.map((image, index) => (
              <div key={index} className="image-preview-container">
                <img
                  src={image.image_url}
                  alt={`Preview ${index + 1}`}
                  className="product-preview-image"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product-view-details">
          <div className="detail-section">
            <h2 className="title text-animation">Basic Information</h2>
            <div className="detail-grid">
              <DetailItem label="Product Code" value={productData.pcode} />
              <DetailItem label="Brand" value={productData.brand} />
              <DetailItem
                label="Category"
                value={productData.ProductCategory?.name}
              />
              <DetailItem label="Weight" value={`${productData.weight} kg`} />
              <DetailItem label="MOQ" value={productData.moq} />
              <DetailItem label="Stock" value={productData.countInStock} />
              <DetailItem
                label="Visibility"
                value={productData.isVisible ? "Visible" : "Hidden"}
                highlight={productData.isVisible}
              />
            </div>
          </div>

          <div className="detail-section">
            <h2 className="title text-animation">Pricing</h2>
            <div className="detail-grid">
              <DetailItem
                label="Price"
                value={formatCurrency(productData.price)}
                highlight
              />
              {productData.ProductDiscount && (
                <>
                  <DetailItem
                    label="Discount Offer"
                    value={`Buy ${
                      productData.ProductDiscount.qty
                    }+ and save ${formatCurrency(
                      productData.ProductDiscount.pricetobereduced
                    )}`}
                    highlight
                  />
                  <DetailItem
                    label="Original Price"
                    value={formatCurrency(
                      productData.price +
                        productData.ProductDiscount.pricetobereduced
                    )}
                    isStriked
                  />
                </>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h2 className="title text-animation">Tax Information</h2>
            <div className="detail-grid">
              <DetailItem label="HSN/SAC Code" value={productData.hsnSac} />
              <DetailItem label="CGST" value={`${productData.CGST}%`} />
              <DetailItem label="SGST" value={`${productData.SGST}%`} />
              <DetailItem label="IGST" value={`${productData.IGST}%`} />
            </div>
          </div>

          <div className="detail-section">
            <h2 className="title text-animation">Ratings & Reviews</h2>
            <div className="rating-display">
              <div className="star-rating">
                <AiFillStar className="star-icon" />
                <span className="detail-label">{productData.rating || 0}</span>
              </div>
              <span className="review-count">
                ({productData.numReviews || 0} reviews)
              </span>
            </div>
          </div>
          {productData.productType === "EXPORT" && (
            <div className="detail-section">
              <h2 className="title text-animation">Export Information</h2>
              <div className="detail-grid">
                <DetailItem
                  label="Variant"
                  value={getCountryName(productData.variant)}
                />
                <DetailItem
                  label="Inco Term"
                  value={productData.ProductIncoTerm?.inco_term_name}
                />
                <DetailItem
                  label="Port"
                  value={
                    productData.ProductPort
                      ? `${productData.ProductPort.district}, ${productData.ProductPort.country}`
                      : "N/A"
                  }
                />
              </div>
            </div>
          )}

          <div className="detail-section">
            <h2 className="title text-animation">Description</h2>
            <p className="productt-description">{productData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight = false, isStriked = false }) => {
  return (
    <div className={`detail-item ${highlight ? "highlight" : ""}`}>
      <span className="detail-label">{label}:</span>
      <span className={`detail-value ${isStriked ? "striked" : ""}`}>
        {value || "N/A"}
      </span>
    </div>
  );
};

export default ProductView;
