import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import getImage from "../../../Utils/GetImage";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log("ajfb", res)
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div>
      <h1 className="title text-animation">Create Product</h1>

      <div className="product-details-content">
        <div className="product-image-wrapper">
          <img
            className={`product-main-image ${!imageUrl ? "empty" : ""}`}
            src={getImage(imageUrl) || ""}
            alt={name}
            style={{ marginBottom: "2rem" }}
          />
          <div className="form-group">
          <label className="form-label" style={{width:"100%"}}>
            {image ? image.name : "Upload image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="form-control"
            />
          </label>
          </div>
        </div>

        <div className="product-info" style={{ width: "100%" }}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Brand</label>
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
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSubmit} className="btn-customized" style={{width:"100%"}}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
