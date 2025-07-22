import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../../redux/api/categoryApiSlice";
import Loader from "../../../components/Common/Loader";
import Message from "../../../components/Common/Message";
import CategoryForm from "../../../components/Protected_Routes/Admin/CategoryForm";
import Modal from "../../../components/Protected_Routes/Admin/Modal";

const CategoryList = () => {
  const {
    data: categories,
    refetch,
    isLoading,
    error,
  } = useFetchCategoriesQuery();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await createCategory({ name }).unwrap();
      await refetch();
      if (result.error) {
        alert(result.error);
      } else {
        setName("");
        alert(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      alert("Creating category failed, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await updateCategory({
        categoryId: selectedCategory.id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();
      await refetch();

      if (result.error) {
        alert(result.error);
      } else {
       alert(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    const confirmed = window.confirm(
      `⚠️ WARNING: Deleting this category will also delete all associated products. Do you want to continue?`
    );

    if (!confirmed) return;
    try {
      setLoading(true);
      const result = await deleteCategory(selectedCategory.id).unwrap();
      await refetch();
      if (result.error) {
        alert(result.error);
      } else {
        alert(`Deleted Sucessfully.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      alert("Category delection failed. Tray again.");
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
              <h1 className="title text-animation">Manage Categories</h1>
              <CategoryForm
                value={name}
                setValue={setName}
                handleSubmit={handleCreateCategory}
                disabled={loading}
              />

              <div className="vertical-divider"></div>
            </div>
            <div className="category-list">
              {categories?.map((category) => (
                <span key={category.id}>
                  <button
                    className="btn-customized"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedCategory(category);
                      setUpdatingName(category.name);
                    }}
                  >
                    {category.name}
                  </button>
                </span>
              ))}
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <CategoryForm
                value={updatingName}
                setValue={(value) => setUpdatingName(value)}
                handleSubmit={handleUpdateCategory}
                buttonText="Update"
                handleDelete={handleDeleteCategory}
                disabled={loading}
              />
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;
