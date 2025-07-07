import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useFetchShippingAddressQuery,
} from "../../../redux/api/shippingAddressApiSlice";
import ProgressSteps from "../../../components/Protected_Routes/User/Cart/ProgressSteps";
import { toast } from "react-toastify";
import Loader from "../../../components/Common/Loader";

const Shipping = () => {
  const {
    data: shippingAddress,
    refetch,
    isLoading,
  } = useFetchShippingAddressQuery();
  const [createShippingAddress] = useCreateShippingAddressMutation();
  const [updateShippingAddress] = useUpdateShippingAddressMutation();
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RazorPay");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [gstin, setGstin] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [transportation, setTransportation] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState("India");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryDistrict, setDeliveryDistrict] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [deliveryStateOptions, setDeliveryStateOptions] = useState([]);
  const [deliveryDistrictOptions, setDeliveryDistrictOptions] = useState([]);
  const [useSameAddress, setUseSameAddress] = useState(true);

  useEffect(() => {
    const india = Country.getAllCountries().find((c) => c.name === "India");
    if (india) {
      const states = State.getStatesOfCountry(india.isoCode);
      setStateOptions(states);
      setDeliveryStateOptions(states);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (state) {
      const india = Country.getAllCountries().find((c) => c.name === "India");
      if (india) {
        const cities = City.getCitiesOfState(india.isoCode, state);
        setDistrictOptions(cities);
      }
    } else {
      setDistrictOptions([]);
    }
  }, [state]);

  useEffect(() => {
    if (deliveryState) {
      const india = Country.getAllCountries().find((c) => c.name === "India");
      if (india) {
        const cities = City.getCitiesOfState(india.isoCode, deliveryState);
        setDeliveryDistrictOptions(cities);
      }
    } else {
      setDeliveryDistrictOptions([]);
    }
  }, [deliveryState]);

  useEffect(() => {
    if (shippingAddress) {
      setAddressLine1(shippingAddress.addressLine1 || "");
      setAddressLine2(shippingAddress.addressLine2 || "");
      setPincode(shippingAddress.pincode || "");
      setGstin(shippingAddress.gstin || "");
      setContactNumber(shippingAddress.contactNumber || "");
      setTransportation(shippingAddress.transportation || "");
      setVehicleNumber(shippingAddress.vehicleNumber || "");
      setCountry(shippingAddress.country || "India");
      setState(shippingAddress.state || "");
      setDistrict(shippingAddress.district || "");
      setDeliveryCountry(shippingAddress.deliveryCountry || "India");
      setDeliveryState(shippingAddress.deliveryState || "");
      setDeliveryDistrict(shippingAddress.deliveryDistrict || "");
      setDeliveryPincode(shippingAddress.deliveryPincode || "");
      setUseSameAddress(
        shippingAddress.deliveryCountry === shippingAddress.country &&
          shippingAddress.deliveryState === shippingAddress.state &&
          shippingAddress.deliveryDistrict === shippingAddress.district &&
          shippingAddress.deliveryPincode === shippingAddress.pincode
      );
      setIsEditMode(false);
    }
  }, [shippingAddress]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const shippingData = {
      addressLine1,
      addressLine2,
      country,
      state,
      district,
      pincode,
      gstin,
      contactNumber,
      transportation,
      vehicleNumber,
      deliveryCountry: useSameAddress ? country : deliveryCountry,
      deliveryState: useSameAddress ? state : deliveryState,
      deliveryDistrict: useSameAddress ? district : deliveryDistrict,
      deliveryPincode: useSameAddress ? pincode : deliveryPincode,
    };

    try {
      let result;
      if (shippingAddress) {
        result = await updateShippingAddress({
          shippingAddressId: shippingAddress.id,
          updatedShippingAddress: shippingData,
        }).unwrap();
        toast.success("Shipping Address updated successfully");
      } else {
        result = await createShippingAddress({
          newShippingAddress: shippingData,
        }).unwrap();
        toast.success("Shipping Address created successfully");
      }

      await refetch();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Operation failed, try again.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this shipping address?")
    ) {
      try {
        await deleteShippingAddress(shippingAddress.id).unwrap();
        toast.success("Shipping Address deleted successfully");
        navigate("/cart");
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.error || "Delete failed, try again.");
      }
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div>
      <ProgressSteps step1 step2 />
      <div className="shipping-content">
        {shippingAddress && !isEditMode ? (
          <div className="shipping-form">
            <h1
              className="title text-animation"
              style={{ marginBottom: "2rem" }}
            >
              Shipping Details
            </h1>

            <div className="address-card">
              <div className="address-section">
                <h2>Customer Information</h2>
                <p>
                  <strong>Contact:</strong> {shippingAddress.contactNumber}
                </p>
                {shippingAddress.gstin && (
                  <p>
                    <strong>GSTIN:</strong> {shippingAddress.gstin}
                  </p>
                )}
              </div>

              <div className="address-section">
                <h2>Shipping Address</h2>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && (
                  <p>{shippingAddress.addressLine2}</p>
                )}
                <p>
                  {shippingAddress.district}, {shippingAddress.state}
                </p>
                <p>
                  {shippingAddress.country} - {shippingAddress.pincode}
                </p>
              </div>

              {!useSameAddress && (
                <div className="address-section">
                  <h2>Delivery Address</h2>
                  <p>
                    {shippingAddress.deliveryDistrict},{" "}
                    {shippingAddress.deliveryState}
                  </p>
                  <p>
                    {shippingAddress.deliveryCountry} -{" "}
                    {shippingAddress.deliveryPincode}
                  </p>
                </div>
              )}

              {(shippingAddress.transportation ||
                shippingAddress.vehicleNumber) && (
                <div className="address-section">
                  <h2>Transportation Details</h2>
                  {shippingAddress.transportation && (
                    <p>
                      <strong>Transportation:</strong>{" "}
                      {shippingAddress.transportation}
                    </p>
                  )}
                  {shippingAddress.vehicleNumber && (
                    <p>
                      <strong>Vehicle No:</strong>{" "}
                      {shippingAddress.vehicleNumber}
                    </p>
                  )}
                </div>
              )}

              <div className="address-section">
                <h2>Payment Method</h2>
                <p>RazorPay</p>
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn-customized"
                onClick={() => setIsEditMode(true)}
              >
                Edit Address
              </button>
              <button
                type="button"
                className="btn-customized danger"
                onClick={handleDelete}
              >
                Delete Address
              </button>
              <button
                type="button"
                className="btn-customized primary"
                onClick={() => navigate("/placeorder")}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="shipping-form">
            <h1 className="title text-animation">
              {shippingAddress
                ? "Edit Shipping Details"
                : "Add Shipping Details"}
            </h1>

            <div className="form-section" style={{ marginTop: "2rem" }}>
              <h2 className="title">Customer Information</h2>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={contactNumber}
                  onChange={setContactNumber}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  title="Enter valid GSTIN (e.g. 22AAAAA0000A1Z5)"
                />
              </div>
            </div>
            <div className="form-section">
              <h2 className="section-title">Customer Address</h2>

              <div className="form-group">
                <label className="form-label">Address Line 1</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Street no/Landmark"
                  value={addressLine1}
                  required
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apartment, suite, etc."
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
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

              <div className="form-row">
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
                  <label className="form-label">District</label>
                  <select
                    className="form-control"
                    value={district}
                    required
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!state}
                  >
                    <option value="">Select District</option>
                    {districtOptions.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter pincode"
                  value={pincode}
                  required
                  onChange={(e) => setPincode(e.target.value)}
                  pattern="^[1-9][0-9]{5}$"
                  title="Enter 6-digit Indian pincode"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group same-line">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={useSameAddress}
                    onChange={() => setUseSameAddress(!useSameAddress)}
                    className="form-control"
                  />
                  Same as shipping address
                </label>
              </div>

              {!useSameAddress && (
                <>
                  <h2 className="section-title">Delivery Address</h2>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value="India"
                      readOnly
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <select
                        className="form-control"
                        value={deliveryState}
                        required
                        onChange={(e) => setDeliveryState(e.target.value)}
                      >
                        <option value="">Select State</option>
                        {deliveryStateOptions.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">District</label>
                      <select
                        className="form-control"
                        value={deliveryDistrict}
                        required
                        onChange={(e) => setDeliveryDistrict(e.target.value)}
                        disabled={!deliveryState}
                      >
                        <option value="">Select District</option>
                        {deliveryDistrictOptions.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter pincode"
                      value={deliveryPincode}
                      required
                      onChange={(e) => setDeliveryPincode(e.target.value)}
                      pattern="^[1-9][0-9]{5}$"
                      title="Enter 6-digit Indian pincode"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-section">
              <h2 className="section-title">Transportation Details</h2>

              <div className="form-group">
                <label className="form-label">Transportation Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter transportation name"
                  value={transportation}
                  required
                  onChange={(e) => setTransportation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter vehicle number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-method-options">
                <label className="payment-method-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RazorPay"
                    checked={paymentMethod === "RazorPay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  />
                  <span className="payment-method-text">RazorPay</span>
                </label>
              </div>
            </div>

            <div className="button-group">
              <button className="btn-customized" type="submit">
                {shippingAddress ? "Update Address" : "Create Address"}
              </button>
              {shippingAddress && (
                <button
                  type="button"
                  className="btn-customized secondary"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Shipping;