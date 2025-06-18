import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import getImage from "../../../Utils/GetImage";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params.id);
  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);
  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  console.log("sss", productData);
  useEffect(() => {
    if (productData && productData.id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.ProductCategory?.id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
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
  }, [productData]);

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
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const existingToKeep = images
        .filter((img) => img.type === "existing")
        .map((img) => img.id);
      formData.append("existingImages", JSON.stringify(existingToKeep));

      images
        .filter((img) => img.type === "new")
        .forEach((img) => {
          formData.append("images", img.file);
        });

      const data = await updateProduct({ productId: params.id, formData });

      if (data?.error) {
        toast.error(data.error);
      } else {
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      await deleteProduct(params.id);

      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
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
              min="1"
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
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Count In Stock</label>
            <input
              type="text"
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
              value={category}
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
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
