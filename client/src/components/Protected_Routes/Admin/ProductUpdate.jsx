import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Country } from "country-state-city";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "../../../redux/api/productApiSlice";
import {
  useFetchCategoriesQuery,
} from "../../../redux/api/categoryApiSlice";
import { useFetchIncoTermsQuery } from "../../../redux/api/incoTermApiSlice";
import { useFetchPortsQuery } from "../../../redux/api/portApiSlice";
import { toast } from "react-toastify";
import getImage from "../../../Utils/GetImage";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params.id);
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [hsnSac, setHsnSac] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [productType, setProductType] = useState("WHOLESALE");
  const [incoTerm, setIncoTerm] = useState("");
  const [port, setPort] = useState("");
  const [country, setCountry] = useState("");

  const { data: categories = [] } = useFetchCategoriesQuery();
  const { data: incoTerms = [] } = useFetchIncoTermsQuery();
  const { data: ports = [] } = useFetchPortsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((c) => ({
      name: c.name,
      isoCode: c.isoCode,
    }));
    setCountryOptions(countries);
  }, []);

  useEffect(() => {
    if (productData && productData.id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.ProductCategory?.id || "");
      setQuantity(productData.weight);
      setBrand(productData.brand);
      setStock(productData.countInStock);
      setHsnSac(productData.hsnSac || "");
      setCgst(productData.CGST || "");
      setSgst(productData.SGST || "");
      setIsVisible(productData.isVisible);

      setProductType(productData.productType);
      setIncoTerm(productData.ProductIncoTerm?.id || "");
      setPort(productData.ProductPort?.id || "");

      if (productData.variant) {
        setCountry(productData.variant);
      }

      const initialImages = productData.ProductImages.map((img) => ({
        type: "existing",
        id: img.id,
        image_name: img.image_name,
      }));
      setImages(initialImages);
      setPreviews(
        initialImages.map((img) => getImage(img.image_name, "ProductImage"))
      );
    }
  }, [productData, countryOptions]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 4 - images.length;

    if (files.length > availableSlots) {
      toast.error(`You can only add ${availableSlots} more image(s)`);
      return;
    }

    const newImages = files.map((file) => ({
      type: "new",
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    if (images[index].type === "new") {
      URL.revokeObjectURL(previews[index]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      formData.append("productType", productType);
      formData.append("hsnSac", hsnSac);
      formData.append("cgst", cgst);
      formData.append("sgst", sgst);
      formData.append("isVisible", isVisible);

      if (productType === "EXPORT") {
        formData.append("incoTerm", incoTerm);
        formData.append("port", port);
        formData.append("variant", country);
      }

      const existingToKeep = images
        .filter((img) => img.type === "existing")
        .map((img) => img.id);
      formData.append("existingImages", JSON.stringify(existingToKeep));

      images
        .filter((img) => img.type === "new")
        .forEach((img) => {
          formData.append("images", img.file);
        });

      const { data, error } = await updateProduct({
        productId: params.id,
        formData,
      });

      if (error) {
        toast.error(error.data?.message || "Update failed");
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      await deleteProduct(params.id).unwrap();
      toast.success("Product deleted successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div>
      <h1 className="title text-animation">Update / Delete Product</h1>

      <div className="product-details-content">
        <div className="product-images-section">
          <div className="image-preview-grid">
            {previews.map((preview, index) => (
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

            {previews.length < 4 && (
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
                    Add Image ({4 - previews.length} remaining)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="product-info" style={{ width: "100%" }}>
          <div className="form-group">
            <label className="form-label">Product Type</label>
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
            <label className="form-label">Visibility</label>
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
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weight (in KG)</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">HSN/SAC Code</label>
            <input
              type="number"
              className="form-control"
              value={hsnSac}
              onChange={(e) => setHsnSac(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">CGST (%)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={cgst}
              onChange={(e) => setCgst(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">SGST (%)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={sgst}
              onChange={(e) => setSgst(e.target.value)}
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
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={category}
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
                  <option value="">Select Country</option>
                  {countryOptions.map((c) => (
                    <option key={c.isoCode} value={c.name}>
                      {c.name}
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
                  {ports?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.district} - {p.country}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="btn-group">
            <button onClick={handleSubmit} className="btn btn-primary">
              Update
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;