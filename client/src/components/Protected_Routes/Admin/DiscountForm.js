import { useState } from "react";

const DiscountForm = ({
  initialValues,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  disabled = false,
}) => {
  const [formData, setFormData] = useState({
    quantity: initialValues.quantity,
    priceToReduce: initialValues.priceToReduce
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.priceToReduce) {
      return;
    }
    handleSubmit(formData);
  };

  return (
    <div className="p-3">
      <form onSubmit={onSubmit} className="form-group">
        <input
          type="number"
          name="quantity"
          className="form-control mb-3"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          type="number"
          name="priceToReduce"
          className="form-control mb-3"
          placeholder="Price to reduce"
          value={formData.priceToReduce}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />

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

export default DiscountForm;