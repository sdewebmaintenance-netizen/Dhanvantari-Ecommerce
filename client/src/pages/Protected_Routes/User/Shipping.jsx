import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from 'country-state-city';
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../../redux/features/cart/cartSlice";
import ProgressSteps from "../../../components/Protected_Routes/User/Cart/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("RazorPay");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  
  const [country, setCountry] = useState(shippingAddress.country || "India");
  const [state, setState] = useState(shippingAddress.state || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const india = Country.getAllCountries().find(c => c.name === "India");
    if (india) {
      const states = State.getStatesOfCountry(india.isoCode);
      setStateOptions(states);
    }
  }, []);

  useEffect(() => {
    if (state) {
      const india = Country.getAllCountries().find(c => c.name === "India");
      if (india) {
        const cities = City.getCitiesOfState(india.isoCode, state);
        setCityOptions(cities);
      }
    } else {
      setCityOptions([]);
    }
    setCity(""); 
  }, [state]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ 
      address, 
      city, 
      state,
      postalCode, 
      country 
    }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div>
      <ProgressSteps step1 step2 />
      <div className="shipping-content">
        <form onSubmit={submitHandler} className="shipping-form">
          <h1 className="title text-animation">Shipping</h1>
          <div style={{ margin: "2rem" }} />

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              value="India"
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <select
              className="form-control"
              value={state}
              required
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {stateOptions.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <select
              className="form-control"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              disabled={!state}
            >
              <option value="">Select City</option>
              {cityOptions.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Postal Code</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Method</label>
            <div className="payment-method-options">
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RazorPay"
                  checked={paymentMethod === "RazorPay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-method-text">RazorPay</span>
              </label>
            </div>
          </div>

          <button
            className="btn-customized"
            type="submit"
            style={{ width: "100%" }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;