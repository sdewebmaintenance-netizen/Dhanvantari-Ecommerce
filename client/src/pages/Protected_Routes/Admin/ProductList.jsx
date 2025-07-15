import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";

import { useFetchIncoTermsQuery } from "../../../redux/api/incoTermApiSlice";
import { useFetchDiscountsQuery } from "../../../redux/api/discountApiSlice";
import { useFetchPortsQuery } from "../../../redux/api/portApiSlice";
import { toast } from "react-toastify";
import { Country } from "country-state-city";

const ProductList = () => {
  const [image, setImage] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [productType, setProductType] = useState("WHOLESALE");
  const [incoTerm, setIncoTerm] = useState("");
  const [port, setPort] = useState("");
  const [country, setCountry] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [hsnSac, setHsnSac] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [discount, setDiscount] = useState("");
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const { data: incoTerms } = useFetchIncoTermsQuery();
  const { data: ports } = useFetchPortsQuery();
  const { data: discounts } = useFetchDiscountsQuery();

  console.log("categories", categories);
  const countryOptions = Country.getAllCountries();

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategory(categories[0].id);
    }
    if (incoTerms && incoTerms.length > 0) {
      setIncoTerm(incoTerms[0].id);
    }
    if (ports && ports.length > 0) {
      setPort(ports[0].id);
    }

    if (countryOptions.length > 0) {
      const india = countryOptions.find((c) => c.name === "India");
      setCountry(india ? india.name : countryOptions[0].name);
    }

    if (discounts && discounts.length > 0) {
      setDiscount("");
    }
  }, [categories, incoTerms, ports, countryOptions, discounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();

      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("moq", moq);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("productType", productType);
      productData.append("isVisible", isVisible);
      productData.append("hsnSac", hsnSac);
      productData.append("cgst", cgst);
      productData.append("sgst", sgst);
      productData.append("igst", igst);
      productData.append("discount", discount);

      if (productType === "EXPORT") {
        productData.append("incoTerm", incoTerm);
        productData.append("port", port);
        productData.append("variant", country);
      }

      image.forEach((img) => {
        productData.append("images", img);
      });

      const { data, error } = await createProduct(productData);

      if (error) {
        toast.error("Product create failed. Try Again.");
      } else {
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files).slice(0, 4);

    if (files.length + image.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setImage((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const removeImage = (index) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
  };

  console.log("asljhasbafsuiqwbkjla", discounts);
  return (
    <div>
      <h1 className="title text-animation">Create Product</h1>

      <div className="product-details-content">
        <div className="product-images-section">
          <div className="image-preview-grid">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-preview-container">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="product-preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}

            {imagePreviews.length < 4 && (
              <div className="upload-placeholder">
                <label className="upload-label">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="upload-input"
                  />
                  <span className="upload-icon">+</span>
                  <span className="upload-text">
                    Add Image ({4 - imagePreviews.length} remaining)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="product-info" style={{ width: "100%" }}>
          <div className="form-group">
            <label htmlFor="productType" className="form-label">
              Product Type
            </label>
            <select
              className="form-control"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="WHOLESALE">Wholesale</option>
              <option value="EXPORT">Export</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="isVisible" className="form-label">
              Visibility
            </label>
            <div className="visibility-toggle">
              <button
                type="button"
                className={`toggle-btn ${isVisible ? "active" : ""}`}
                onClick={() => setIsVisible(true)}
              >
                Visible
              </button>
              <button
                type="button"
                className={`toggle-btn ${!isVisible ? "active" : ""}`}
                onClick={() => setIsVisible(false)}
              >
                Hidden
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Minimum Order Quantity (MOQ)
            </label>
            <input
              type="number"
              className="form-control"
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Discount</label>
            <select
              className="form-control"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            >
              <option value="">No Discount</option>
              {discounts?.map((dis) => (
                <option key={dis.id} value={dis.id}>
                  {`Buy ${dis.qty}, Reduce ₹${dis.pricetobereduced}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Weight
            </label>
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Brand
            </label>
            <input
              type="text"
              className="form-control"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Count In Stock</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hsnSac" className="form-label">
              HSN/SAC Code
            </label>
            <input
              type="number"
              className="form-control"
              value={hsnSac}
              onChange={(e) => setHsnSac(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cgst" className="form-label">
              CGST (%)
            </label>
            <input
              type="number"
              className="form-control"
              value={cgst}
              onChange={(e) => setCgst(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sgst" className="form-label">
              SGST (%)
            </label>
            <input
              type="number"
              className="form-control"
              value={sgst}
              onChange={(e) => setSgst(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="igst" className="form-label">
              IGST (%)
            </label>
            <input
              type="number"
              className="form-control"
              value={igst}
              onChange={(e) => setIgst(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {productType === "EXPORT" && (
            <>
              <div className="form-group">
                <label className="form-label">Variant</label>
                <select
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countryOptions.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Inco Term</label>
                <select
                  className="form-control"
                  value={incoTerm}
                  onChange={(e) => setIncoTerm(e.target.value)}
                >
                  {incoTerms?.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.inco_term_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Port</label>
                <select
                  className="form-control"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                >
                  {ports?.map((port) => (
                    <option key={port.id} value={port.id}>
                      {port.district}- {port.country}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            className="btn-customized"
            style={{ width: "100%" }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
