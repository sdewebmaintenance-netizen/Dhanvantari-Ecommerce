import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";
import { FaFilter } from "react-icons/fa";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../../../redux/features/shop/shopSlice";
import Loader from "../../../components/Common/Loader";
import ProductCard from "../../../components/Protected_Routes/User/Product/ProductCard";

const   Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");

  const closeFilters = () => setShowFilters(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      let filtered = [...filteredProductsQuery.data];

      // Filter by checked categories
      if (checked.length) {
        filtered = filtered.filter((p) => checked.includes(p.category_id));
      }

      // Filter by selected brand
      if (radio.length) {
        filtered = filtered.filter((p) => radio.includes(p.brand));
      }

      // Filter by price
      if (priceFilter) {
        // filtered = filtered.filter(
        //   (p) =>
        //     p.price.toString().includes(priceFilter) ||
        //     p.price <= parseInt(priceFilter)
        // );
        filtered = filtered.filter((p) => p.price <= parseInt(priceFilter));
      }

      // Filter by discount
      if (selectedDiscount) {
        filtered = filtered.filter(
          (p) =>
            p.ProductDiscount &&
            p.ProductDiscount.qty === parseInt(selectedDiscount)
        );
      }

      // Filter by weight
      if (selectedWeight) {
        filtered = filtered.filter(
          (p) => parseInt(p.weight) === parseInt(selectedWeight)
        );
      }

      dispatch(setProducts(filtered));
    }
  }, [
    checked,
    radio,
    priceFilter,
    selectedDiscount,
    selectedWeight,
    filteredProductsQuery.data,
    dispatch,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  console.log("sss", products);

  const discountOptions = [
    ...new Set(
      filteredProductsQuery.data
        ?.filter((p) => p.ProductDiscount)
        .map((p) => p.ProductDiscount.qty)
    ),
  ];

  const weightOptions = [
    ...new Set(
      filteredProductsQuery.data?.map((p) => p.weight).filter(Boolean)
    ),
  ];

  return (
    <div className="shop-container">
      <div className="shop-content">
        <button
          className="filter-toggle"
          onClick={toggleFilters}
          title="Filter Options"
        >
          <FaFilter size={20} />
        </button>

        <div
          className={`filter-overlay ${showFilters ? "active" : ""}`}
          onClick={toggleFilters}
        />

        <div className={`shop-filters ${showFilters ? "active" : ""}`}>
          <div className="filter-section">
            <h2 className="filter-title">Filter by Categories</h2>

            <div className="filter-options">
              {categories?.map((c) => (
                <div key={c.id} className="filter-option">
                  <div className="filter-checkbox">
                    <input
                      type="checkbox"
                      id={`category-${c.id}`}
                      onChange={(e) => {
                        handleCheck(e.target.checked, c.id);
                        closeFilters();
                      }}
                      className="filter-input"
                    />
                    <label
                      htmlFor={`category-${c.id}`}
                      className="filter-label"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="filter-title">Filter by Brands</h2>

            <div className="filter-options">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="filter-option">
                  <div className="filter-checkbox">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => {
                        handleBrandClick(brand);
                        closeFilters();
                      }}
                      className="filter-input"
                    />
                    <label htmlFor={brand} className="filter-label">
                      {brand}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="filter-title">Filter by Discount Quantity</h2>
            <div className="filter-options">
              <select
                className="form-control"
                value={selectedDiscount}
                onChange={(e) => {
                  setSelectedDiscount(e.target.value);
                  closeFilters();
                }}
              >
                <option value="">All</option>
                {discountOptions.map((qty) => (
                  <option key={qty} value={qty}>
                    {qty}+ units
                  </option>
                ))}
              </select>
            </div>

            <h2 className="filter-title">Filter by Weight</h2>
            <div className="filter-options">
              <select
                className="form-control"
                value={selectedWeight}
                onChange={(e) => {
                  setSelectedWeight(e.target.value);
                  closeFilters();
                }}
              >
                <option value="">All</option>
                {weightOptions.map((w) => (
                  <option key={w} value={w}>
                    {w} Kg
                  </option>
                ))}
              </select>
            </div>

            <h2 className="filter-title">Filter by Price</h2>

            <div className="filter-options">
              <input
                type="number"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="price-input"
              />
            </div>

            <div className="filter-actions">
              <button
                className="reset-btn"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {isAddingToCart ? (
          <Loader />
        ) : (
          <div className="shop-products">
            <h2 className="products-count">{products?.length} Products</h2>
            
       
              {filteredProductsQuery.isLoading ? (
                <div><Loader /></div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <p style={{ textAlign: "center" }}>No products available to match your criteria.</p>
                </div>
              ) : (
            <div className="products-grid">
              {products.map((p) => (
                <div className="product-item" key={p.id}>
                  <ProductCard
                    p={p}
                    setParentLoading={setIsAddingToCart}
                    parentLoading={isAddingToCart}
                  />
                </div>
              ))}
            </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
