import { useState } from "react";
import {
  useCreatePortMutation,
  useUpdatePortMutation,
  useDeletePortMutation,
  useFetchPortsQuery,
} from "../../../redux/api/portApiSlice";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import { toast } from "react-toastify";
import PortForm from "../../../components/Protected_Routes/Admin/PortForm";
import Modal from "../../../components/Protected_Routes/Admin/Modal";

const PortList = () => {
  const {
    data: ports,
    refetch,
    isLoading,
    error,
  } = useFetchPortsQuery();

  const [formData, setFormData] = useState({ 
    country: "",
    district: ""
  });
  
  const [selectedPort, setSelectedPort] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createPort] = useCreatePortMutation();
  const [updatePort] = useUpdatePortMutation();
  const [deletePort] = useDeletePortMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.country || !formData.district) {
      toast.error("Country and district are required");
      return;
    }

    try {
      setLoading(true);
      const result = await createPort({
        country: formData.country,
        district: formData.district
      }).unwrap();
      await refetch();
      if (result.error) {
        toast.error(result.error);
      } else {
        setFormData({ country: "", district: "" });
        toast.success(`Port created successfully`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating port failed, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.country || !formData.district) {
      toast.error("Country and district are required");
      return;
    }

    try {
      setLoading(true);
      const result = await updatePort({
        portId: selectedPort.id,
        updatedPort: {
          country: formData.country,
          district: formData.district
        },
      }).unwrap();
      await refetch();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Port updated successfully`);
        setSelectedPort(null);
        setFormData({ country: "", district: "" });
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await deletePort(selectedPort.id).unwrap();
      await refetch();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Port deleted successfully`);
        setSelectedPort(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Port deletion failed. Try again.");
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
              <h1 className="title text-animation">Manage Ports</h1>
              <PortForm
                value={formData}
                setValue={setFormData}
                handleSubmit={handleCreate}
                disabled={loading}
              />

              <div className="vertical-divider"></div>
            </div>
            <div className="category-list">
              {ports?.map((port) => (
                <span key={port.id}>
                  <button
                    className="btn-customized"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedPort(port);
                      setFormData({ 
                        country: port.country,
                        district: port.district || ""
                      });
                    }}
                  >
                    {port.district} - {port.country}
                  </button>
                </span>
              ))}
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <PortForm
                value={formData}
                setValue={setFormData}
                handleSubmit={handleUpdate}
                buttonText="Update"
                handleDelete={handleDelete}
                disabled={loading}
              />
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default PortList;