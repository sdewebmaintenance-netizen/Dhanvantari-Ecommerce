const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  disabled = false,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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

export default CategoryForm;