import { Country, City } from "country-state-city";
import { useEffect, useState } from "react";

const PortForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  disabled = false,
}) => {
  const [countries, setCountries] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    // Load countries
    const countryList = Country.getAllCountries().map(c => ({
      isoCode: c.isoCode,
      name: c.name
    }));
    setCountries(countryList);
  }, []);

  useEffect(() => {
    // Load districts when country changes
    if (value.country) {
      const countryDistricts = City.getCitiesOfCountry(value.country).map(city => ({
        name: city.name
      }));
      setDistricts(countryDistricts);
    } else {
      setDistricts([]);
    }
  }, [value.country]);

  const handleCountryChange = (e) => {
    setValue({
      ...value,
      country: e.target.value,
      district: "" // Reset district when country changes
    });
  };

  const handleDistrictChange = (e) => {
    setValue({
      ...value,
      district: e.target.value
    });
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <select
            className="form-control"
            value={value.country}
            onChange={handleCountryChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-control"
            value={value.district}
            onChange={handleDistrictChange}
            disabled={!value.country}
            required
          >
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={`${district.name}-${index}`} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" disabled={disabled}>
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={disabled}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PortForm;