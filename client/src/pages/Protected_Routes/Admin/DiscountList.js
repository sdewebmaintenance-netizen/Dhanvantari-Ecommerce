import { useState } from "react";
import {
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useFetchDiscountsQuery,
} from "../../../redux/api/discountApiSlice";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import Modal from "../../../components/Protected_Routes/Admin/Modal";
import DiscountForm from "../../../components/Protected_Routes/Admin/DiscountForm";

const DiscountList = () => {
  const {
    data: discounts,
    refetch,
    isLoading,
    error,
  } = useFetchDiscountsQuery();

  const [quantity, setQuantity] = useState("");
  const [priceToReduce, setPriceToReduce] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createDiscount] = useCreateDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();
  const [deleteDiscount] = useDeleteDiscountMutation();

  const handleCreateDiscount = async (e) => {
    e.preventDefault();

    if (!quantity || !priceToReduce) {
      alert("Both quantity and price to reduce are required");
      return;
    }

    try {
      setLoading(true);
      const result = await createDiscount({
        qty: parseInt(quantity),
        price: parseFloat(priceToReduce),
      }).unwrap();

      await refetch();

      if (result.error) {
       alert(result.error);
      } else {
        setQuantity("");
        setPriceToReduce("");
        alert(`Discount created successfully`);
      }
    } catch (error) {
      console.error(error);
      alert("Creating discount failed, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiscount = async (formData) => {
    try {
      setLoading(true);
      const result = await updateDiscount({
        discountId: selectedDiscount.id,
        updatedDiscount: {
          qty: parseInt(formData.quantity),
          price: parseFloat(formData.priceToReduce),
        },
      }).unwrap();

      await refetch();

      if (result.error) {
        alert(result.error);
      } else {
       alert(`Discount updated successfully`);
        setSelectedDiscount(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      alert("Updating discount failed, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async () => {

    try {
      setLoading(true);
      const result = await deleteDiscount(selectedDiscount.id).unwrap();
      await refetch();

      if (result.error) {
        alert(result.error);
      } else {
       alert(`Discount deleted successfully`);
        setSelectedDiscount(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
     alert("Discount deletion failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md-flex-row">
          <div className="md-w-3/4 p-3">
            <div>
              <h1 className="title text-animation">Manage Discounts</h1>

              <div className="p-3">
                <form onSubmit={handleCreateDiscount} className="form-group">
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Price to reduce"
                    value={priceToReduce}
                    onChange={(e) => setPriceToReduce(e.target.value)}
                    step="0.01"
                    min="0"
                  />

                  <button className="btn btn-primary" disabled={loading}>
                    Create Discount
                  </button>
                </form>
              </div>

              <div className="vertical-divider"></div>
            </div>  

            <div className="category-list">
              {discounts?.map((discount) => (
                <div key={discount.id} className="mb-2">
                  <button
                    className="btn-customized"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedDiscount(discount);
                    }}
                  >
                    {`Buy ${discount.qty}, Reduce ₹${discount.pricetobereduced}`}
                  </button>
                </div>
              ))}
            </div>

            {selectedDiscount && (
              <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <DiscountForm
                  initialValues={{
                    quantity: selectedDiscount.qty.toString(),
                    priceToReduce: selectedDiscount.pricetobereduced.toString()
                  }}
                  handleSubmit={handleUpdateDiscount}
                  buttonText="Update"
                  handleDelete={handleDeleteDiscount}
                  disabled={loading}
                />
              </Modal>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountList;