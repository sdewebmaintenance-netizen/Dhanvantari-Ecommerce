import React, { useState } from "react";
import {
  useAllProductsQuery,
  useRequestQuotaMutation,
} from "../../redux/api/productApiSlice";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Country, State, City } from "country-state-city";
import Modal from "../Protected_Routes/Admin/Modal";
import Loader from "../Common/Loader";
import getImage from "../../Utils/GetImage";

const ProductQuoteTable = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    street: "",
    country: "",
    state: "",
    district: "",
    pincode: "",
    message: "",
  });
  const [productQuantities, setProductQuantities] = useState({});
  const [productSpecs, setProductSpecs] = useState({});

  const [requestQuota] = useRequestQuotaMutation();
  const { data: productsData, isLoading } = useAllProductsQuery();

  const exportProducts =
    productsData?.filter((product) => product.productType === "EXPORT") || [];

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelection = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleProductQuantityChange = (productId, value) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleProductSpecsChange = (productId, value) => {
    setProductSpecs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSendQuoteRequest = async (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    if (contactForm.message.length > 1000) {
      alert("Message should be less than 1000 characters");
      return;
    }

    try {
      setLoading(true);

      const products = selectedProducts.map((product) => ({
        name: product.name,
        quantity: productQuantities[product.id] || "Not specified",
        specifications: productSpecs[product.id] || "Standard",
      }));

      const requestData = {
        ...contactForm,
        phone: phone,
        address: `${contactForm.street}, ${contactForm.district}, ${contactForm.state}, ${contactForm.country} - ${contactForm.pincode}`,
        products: products,
      };

      const result = await requestQuota(requestData).unwrap();

      if (result.error) {
        alert(result.error);
      } else {
        setShowContactForm(false);
        setSelectedProducts([]);
        setModalVisible(false);
        setContactForm({
          name: "",
          email: "",
          company: "",
          street: "",
          country: "",
          state: "",
          district: "",
          pincode: "",
          message: "",
        });
        setPhone("");
        setProductQuantities({});
        setProductSpecs({});
        alert("Quote request submitted successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const availableCountries = Country.getAllCountries();
  const availableStates = contactForm.country
    ? State.getStatesOfCountry(contactForm.country)
    : [];
  const availableCities = contactForm.state
    ? City.getCitiesOfState(contactForm.country, contactForm.state)
    : [];

  return (
    <div className="product-quote-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <table className="product-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Variant</th>
                <th>Inco Term</th>
                <th>Port</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportProducts.map((product, index) => (
                <tr key={product.id || index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(
                        (p) => p.id === product.id
                      )}
                      onChange={() => handleProductSelection(product)}
                    />
                  </td>
                  <td>
                    <img
                      src={product?.ProductImages[0]?.image_url}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.desc && <div className="desc">{product.desc}</div>}
                  </td>
                  <td>{product.variant}</td>
                  <td>
                    {product.ProductIncoTerm?.inco_term_name ||
                      product.incoTerm}
                  </td>
                  <td>{product.ProductPort?.district || product.port}</td>
                  <td>
                    <button
                      className="btn-customized"
                      onClick={() => {
                        handleProductSelection(product);
                        setShowContactForm(true);
                      }}
                    >
                      {selectedProducts.some((p) => p.id === product.id)
                        ? "Selected"
                        : "Select"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedProducts.length > 0 && (
            <button
              className="btn-customized request-quote-btn"
              onClick={() => {
                setShowContactForm(true);
                setModalVisible(true);
              }}
            >
              Request Quote ({selectedProducts.length} selected)
            </button>
          )}

          {showContactForm && (
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <div className="contact-form-modal">
                <div className="contact-form-container">
                  <h3>
                    Request Quote for {selectedProducts.length} Product(s)
                  </h3>
                  <form onSubmit={handleSendQuoteRequest}>
                    <div className="form-group">
                      <label className="form-label">Full Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactFormChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number*</label>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={phone}
                        onChange={setPhone}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={contactForm.company}
                        onChange={handleContactFormChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Street Address*</label>
                      <input
                        type="text"
                        name="street"
                        value={contactForm.street}
                        onChange={handleContactFormChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Country*</label>
                        <select
                          name="country"
                          value={contactForm.country}
                          onChange={handleContactFormChange}
                          required
                          className="form-control"
                        >
                          <option value="">Select Country</option>
                          {availableCountries.map((country) => (
                            <option
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">State/Region*</label>
                        <select
                          name="state"
                          value={contactForm.state}
                          onChange={handleContactFormChange}
                          required
                          disabled={!contactForm.country}
                          className="form-control"
                        >
                          <option value="">Select State</option>
                          {availableStates.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">District/City*</label>
                        <select
                          name="district"
                          value={contactForm.district}
                          onChange={handleContactFormChange}
                          required
                          disabled={!contactForm.state}
                          className="form-control"
                        >
                          <option value="">Select City</option>
                          {availableCities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Postal Code*</label>
                        <input
                          type="text"
                          name="pincode"
                          value={contactForm.pincode}
                          onChange={handleContactFormChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="selected-products-section">
                      <h4>Selected Products</h4>
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="product-input-group">
                          <h6 style={{ marginTop: "1rem" }}>{product.name}</h6>
                          <div className="product-input-row">
                            <div className="form-group">
                              <label className="form-label">Quantity</label>
                              <input
                                type="text"
                                value={productQuantities[product.id] || ""}
                                onChange={(e) =>
                                  handleProductQuantityChange(
                                    product.id,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 100 kg"
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Specifications
                              </label>
                              <input
                                type="text"
                                value={productSpecs[product.id] || ""}
                                onChange={(e) =>
                                  handleProductSpecsChange(
                                    product.id,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Organic certified"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Additional Message (max 1000 characters)
                      </label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        maxLength={1000}
                        className="form-control"
                      />
                      <div className="char-count">
                        {contactForm.message.length}/1000 characters
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-customized cancel-btn"
                        onClick={() => {
                          setShowContactForm(false);
                          setSelectedProducts([]);
                          setModalVisible(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-customized submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Request"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductQuoteTable;
