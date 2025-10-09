import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useFetchShippingAddressQuery,
  useFetchAllShippingAddressQuery,
} from "../../../redux/api/shippingAddressApiSlice";
import { useUpdateCartMutation } from "../../../redux/api/cartApiSlice";
import ProgressSteps from "../../../components/Protected_Routes/User/Cart/ProgressSteps";
import Loader from "../../../components/Common/Loader";

const Shipping = () => {
  const { data, refetch } = useFetchShippingAddressQuery();
  const shippingAddress = data?.shippingAddress;
  const cart = data?.cart;
  const { data: allShippingAddress } = useFetchAllShippingAddressQuery();
  const [updateCart] = useUpdateCartMutation();
  const [createShippingAddress] = useCreateShippingAddressMutation();
  const [updateShippingAddress] = useUpdateShippingAddressMutation();
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addressId, setAddressId] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [gstin, setGstin] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [transportation, setTransportation] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [deliveryAddressLine1, setDeliveryAddressLine1] = useState("");
  const [deliveryAddressLine2, setDeliveryAddressLine2] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState("India");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryDistrict, setDeliveryDistrict] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [deliveryStateOptions, setDeliveryStateOptions] = useState([]);
  const [deliveryDistrictOptions, setDeliveryDistrictOptions] = useState([]);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState(
    shippingAddress?.id || null
  );
  const [hoveredId, setHoveredId] = useState(null);

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

  console.log("District Options:", districtOptions);

  useEffect(() => {
    if (shippingAddress?.id) {
      setSelectedAddressId(shippingAddress.id);
    } else {
      setSelectedAddressId(null);
    }
  }, [shippingAddress]);

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

  const resetForm = () => {
    setAddressId("");
    setAddressLine1("");
    setAddressLine2("");
    setPincode("");
    setGstin("");
    setCustomerName("");
    setContactNumber("");
    setTransportation("");
    setVehicleNumber("");
    setCountry("India");
    setState("");
    setDistrict("");
    setDeliveryCountry("India");
    setDeliveryState("");
    setDeliveryDistrict("");
    setDeliveryPincode("");
    setUseSameAddress(true);
  };

  const fillFormWithAddress = (address) => {
    setAddressId(address.id || "");
    setAddressLine1(address.addressLine1 || "");
    setAddressLine2(address.addressLine2 || "");
    setPincode(address.pincode || "");
    setGstin(address.gstin || "");
    setCustomerName(address.customerName || "");
    setContactNumber(address.contactNumber || "");
    setTransportation(address.transportation || "");
    setVehicleNumber(address.vehicleNumber || "");
    setCountry(address.country || "India");
    setState(address.state || "");
    setDistrict(address.district || "");
    setDeliveryAddressLine1(address.deliveryAddressLine1 || "");
    setDeliveryAddressLine2(address.deliveryAddressLine2 || "");
    setDeliveryCountry(address.deliveryCountry || "India");
    setDeliveryState(address.deliveryState || "");
    setDeliveryDistrict(address.deliveryDistrict || "");
    setDeliveryPincode(address.deliveryPincode || "");
    setUseSameAddress(
      address.deliveryAddressLine1 === addressLine1 &&
        address.deliveryAddressLine2 === addressLine2 &&
        address.deliveryCountry === address.country &&
        address.deliveryState === address.state &&
        address.deliveryDistrict === address.district &&
        address.deliveryPincode === address.pincode
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!contactNumber) {
      alert("Phone number is required!");
      return;
    }
    setIsLoading(true);

    const shippingData = {
      addressId,
      addressLine1,
      addressLine2,
      country,
      state,
      district,
      pincode,
      gstin,
      customerName,
      contactNumber,
      transportation,
      vehicleNumber,
      deliveryAddressLine1: useSameAddress
        ? addressLine1
        : deliveryAddressLine1,
      deliveryAddressLine2: useSameAddress
        ? addressLine2
        : deliveryAddressLine2,
      deliveryCountry: useSameAddress ? country : deliveryCountry,
      deliveryState: useSameAddress ? state : deliveryState,
      deliveryDistrict: useSameAddress ? district : deliveryDistrict,
      deliveryPincode: useSameAddress ? pincode : deliveryPincode,
    };

    console.log("shippin", shippingData);

    try {
      if (isAddingNew) {
        await createShippingAddress({
          newShippingAddress: shippingData,
        }).unwrap();

        alert("Shipping Address created successfully");
        window.location.reload();
      } else {
        await updateShippingAddress({
          shippingAddressId: shippingData.addressId,
          updatedShippingAddress: shippingData,
        }).unwrap();

        alert("Shipping Address updated successfully");
        window.location.reload();
      }

      await refetch();

      setIsEditMode(false);
      setIsAddingNew(false);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (
      window.confirm("Are you sure you want to delete this shipping address?")
    ) {
      setIsLoading(true);
      try {
        await deleteShippingAddress(addressId).unwrap();
        alert("Shipping Address deleted successfully");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert(error?.data?.error || "Delete failed, try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectAddress = async (addressId) => {
    try {
      setIsLoading(true);
      if (!cart || !cart.id) {
        alert("Cart not found. Please try again later.");
        return;
      }
      console.log("sss", addressId, cart.id);
      const isUnselecting = selectedAddressId === addressId;
      await updateCart({
        cartId: cart.id,
        updatedCart: {
          shipping_address_id: isUnselecting ? null : parseInt(addressId),
        },
      }).unwrap();
      await refetch();
      setSelectedAddressId(isUnselecting ? null : addressId);
      alert(
        isUnselecting
          ? "Redirecting to Select New Shipping Address"
          : "Selected Shipping Address successfully"
      );
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    resetForm();
    setIsAddingNew(true);
    setIsEditMode(true);
  };

  const handleEditAddress = (address) => {
    fillFormWithAddress(address);
    setIsAddingNew(false);
    setIsEditMode(true);
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!shippingAddress && allShippingAddress?.length > 0 && !isEditMode) {
    return (
      <div>
        <ProgressSteps step1 step2 />
        <div className="shipping-content">
          <div className="shipping-form">
            <h1
              className="title text-animation"
              style={{ marginBottom: "2rem" }}
            >
              Select Shipping Address
            </h1>

            <div className="address-list">
              {allShippingAddress.map((address) => (
                <div key={address.id} style={{ marginBottom: "2rem" }}>
                  <div className="address-card">
                    <div className="address-section">
                      <div className="btn-address">
                        <h2>Customer Information</h2>
                        <div>
                          <button
                            key={address.id}
                            type="button"
                            title="Select Address"
                            className="btn-icon"
                            onMouseEnter={() => setHoveredId(address.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => handleSelectAddress(address.id)}
                          >
                            {hoveredId === address.id ? (
                              <IoCheckbox />
                            ) : (
                              <MdCheckBoxOutlineBlank />
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit Address"
                            onClick={() => handleEditAddress(address)}
                          >
                            <MdEdit />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Delete Address"
                            onClick={() => handleDelete(address.id)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                      <p>
                        <strong>Customer Name:</strong> {address.customerName}
                      </p>
                      <p>
                        <strong>Contact:</strong> {address.contactNumber}
                      </p>

                      {address.gstin && (
                        <p>
                          <strong>GSTIN:</strong> {address.gstin}
                        </p>
                      )}
                    </div>

                    <div className="address-section">
                      <h2>Shipping Address</h2>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.district}, {address.state}
                      </p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                    </div>

                    {((address.deliveryCountry &&
                      address.deliveryCountry !== address.country) ||
                      (address.deliveryState &&
                        address.deliveryState !== address.state) ||
                      (address.deliveryDistrict &&
                        address.deliveryDistrict !== address.district) ||
                      (address.deliveryPincode &&
                        address.deliveryPincode !== address.pincode)) && (
                      <div className="address-section">
                        <h2>Delivery Address</h2>
                        <p>{address.deliveryAddressLine1}</p>
                        {address.deliveryAddressLine2 && (
                          <p>{address.deliveryAddressLine2}</p>
                        )}
                        {address.deliveryDistrict && address.deliveryState ? (
                          <p>
                            {address.deliveryDistrict}, {address.deliveryState}
                          </p>
                        ) : (
                          <p>
                            {address.deliveryDistrict || address.deliveryState}
                          </p>
                        )}
                        {(address.deliveryCountry ||
                          address.deliveryPincode) && (
                          <p>
                            {address.deliveryCountry}
                            {address.deliveryPincode &&
                              ` - ${address.deliveryPincode}`}
                          </p>
                        )}
                      </div>
                    )}

                    {(address.transportation || address.vehicleNumber) && (
                      <div className="address-section">
                        <h2>Transportation Details</h2>

                        {address.transportation && (
                          <p>
                            <strong>Transportation:</strong>{" "}
                            {address.transportation}
                          </p>
                        )}

                        {address.vehicleNumber && (
                          <p>
                            <strong>Vehicle No:</strong> {address.vehicleNumber}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allShippingAddress.length < 3 && (
              <div className="button-group" style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className="btn-customized"
                  onClick={handleAddNewAddress}
                >
                  Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div>
        <ProgressSteps step1 step2 />
        <div className="shipping-content">
          <form onSubmit={submitHandler} className="shipping-form">
            <h1 className="title text-animation">
              {isAddingNew
                ? "Add New Shipping Address"
                : "Edit Shipping Address"}
            </h1>

            <div className="form-section" style={{ marginTop: "2rem" }}>
              <h2 className="title">Customer Information</h2>

              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Customer Name"
                  value={customerName}
                  required
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={contactNumber}
                  onChange={setContactNumber}
                  className="form-control"
                  inputProps={{ required: true }}
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
              <h2 className="section-title">Shipping Address</h2>

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

              <div className="form-row ismobile">
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
                    <option value="">-- Select a State First --</option>

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

            <div className="form-section ">
              <div className="form-group same-line">
                <input
                  type="checkbox"
                  checked={useSameAddress}
                  onChange={() => setUseSameAddress(!useSameAddress)}
                  className="form-control ship-checkbox"
                />
                <label className="form-label">Same as shipping address </label>
              </div>

              {!useSameAddress && (
                <>
                  <h2 className="section-title">Delivery Address</h2>

                  <div className="form-group">
                    <div>
                      <label className="form-label">Address Line 1</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Street no/Landmark"
                        value={deliveryAddressLine1}
                        required
                        onChange={(e) =>
                          setDeliveryAddressLine1(e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="form-label">Address Line 2</label>
                      <input
                        type="text"
                        className="form-control"
                        value={deliveryAddressLine2}
                        onChange={(e) =>
                          setDeliveryAddressLine2(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row ismobile">
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
                        <option value="">Select State First</option>
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
                  placeholder="Enter Transportation Name"
                  value={transportation}
                  required
                  onChange={(e) => setTransportation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transport Delivery Location (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Vehicle Number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="button-group">
              <button className="btn-customized" type="submit">
                {isAddingNew ? "Create Address" : "Update Address"}
              </button>
              <button
                type="button"
                className="btn-customized secondary"
                onClick={() => {
                  setIsEditMode(false);
                  setIsAddingNew(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressSteps step1 step2 />
      <div className="shipping-content">
        <div className="shipping-form">
          <h1 className="title text-animation" style={{ marginBottom: "2rem" }}>
            Shipping Details
          </h1>

          {shippingAddress ? (
            <>
              <div className="address-card">
                <div className="address-section">
                  <h2>Customer Information</h2>
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {shippingAddress.customerName}
                  </p>
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
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="btn-customized danger"
                  onClick={() => handleSelectAddress(selectedAddressId)}
                >
                  Select Different Address
                </button>
                <button
                  type="button"
                  className="btn-customized"
                  onClick={() => handleEditAddress(shippingAddress)}
                >
                  Edit Address
                </button>
                <button
                  type="button"
                  className="btn-customized danger"
                  onClick={() => handleDelete(shippingAddress.id)}
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
            </>
          ) : (
            <>
              <p>No shipping address created</p>
              <div className="button-group">
                <button
                  type="button"
                  className="btn-customized"
                  onClick={handleAddNewAddress}
                >
                  Add New Address
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shipping;
