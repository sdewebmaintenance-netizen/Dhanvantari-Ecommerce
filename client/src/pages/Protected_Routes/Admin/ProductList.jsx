import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import getImage from "../../../Utils/GetImage";

const ProductList = () => {
  const [image, setImage] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  console.log("categories", categories);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategory(categories[0].id);
    }
  }, [categories]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();

      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      image.forEach((img) => {
      productData.append("images", img);
    });


      const {data, error} = await createProduct(productData);

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

  console.log("asljhasbafsuiqwbkjla", image);
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
              Quantity
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
