import { useState } from "react";
import {
  useCreateIncoTermMutation,
  useUpdateIncoTermMutation,
  useDeleteIncoTermMutation,
  useFetchIncoTermsQuery,
} from "../../../redux/api/incoTermApiSlice";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import IncoTermForm from "../../../components/Protected_Routes/Admin/IncoTermForm";
import Modal from "../../../components/Protected_Routes/Admin/Modal";

const IncoTermList = () => {
  const {
    data: incoTerms,
    refetch,
    isLoading,
    error,
  } = useFetchIncoTermsQuery();

  const [name, setName] = useState("");
  const [selectedIncoTerm, setSelectedIncoTerm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createIncoTerm] = useCreateIncoTermMutation();
  const [updateIncoTerm] = useUpdateIncoTermMutation();
  const [deleteIncoTerm] = useDeleteIncoTermMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("IncoTerm name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await createIncoTerm({ inco_term_name: name }).unwrap();
      await refetch();
      if (result.error) {
        alert(result.error);
      } else {
        setName("");
        alert(`${result.inco_term_name} is created.`);
      }
    } catch (error) {
      console.error(error);
      alert("Creating IncoTerm failed, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("IncoTerm name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await updateIncoTerm({
        incoTermId: selectedIncoTerm.id,
        updatedIncoTerm: { inco_term_name: name },
      }).unwrap();
      await refetch();

      if (result.error) {
      alert(result.error);
      } else {
       alert(`${result.inco_term_name} is updated`);
        setSelectedIncoTerm(null);
        setName("");
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
      const result = await deleteIncoTerm(selectedIncoTerm.id).unwrap();
      await refetch();
      if (result.error) {
alert(result.error);
      } else {
        alert(`Deleted Successfully.`);
        setSelectedIncoTerm(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
alert("IncoTerm deletion failed. Try again.");
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
              <h1 className="title text-animation">Manage Inco Terms</h1>
              <IncoTermForm
                value={name}
                setValue={setName}
                handleSubmit={handleCreate}
                disabled={loading}
              />

              <div className="vertical-divider"></div>
            </div>
            <div className="category-list">
              {incoTerms?.map((incoTerm) => (
                <span key={incoTerm.id}>
                  <button
                    className="btn-customized"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedIncoTerm(incoTerm);
                      setName(incoTerm.inco_term_name);
                    }}
                  >
                    {incoTerm.inco_term_name}
                  </button>
                </span>
              ))}
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <IncoTermForm
                value={name}
                setValue={setName}
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

export default IncoTermList;