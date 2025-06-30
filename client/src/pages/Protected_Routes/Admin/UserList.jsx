import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Message from "../../../components/Common/Message";
import Loader from "../../../components/Common/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import PaginationControls from "../../../Utils/PaginationControls";
import { IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  console.log("afbiu", users);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    entriesPerPage: 10,
    totalEntries: users?.length,
  });

  useEffect(() => {
    if (users) {
      setPagination((prev) => ({
        ...prev,
        totalEntries: users.length,
      }));
    }
  }, [users]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <IoMdArrowRoundUp className="sort-icon" />
    ) : (
      <IoMdArrowRoundDown className="sort-icon" />
    );
  };

  const getSortedData = () => {
    if (!users) return [];

    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleEntriesPerPageChange = (size) => {
    setPagination((prev) => ({
      ...prev,
      entriesPerPage: size,
      currentPage: 1,
    }));
  };

  const filteredData = getSortedData().filter(
    (order) =>
      order?.username?.toString().includes(searchTerm) ||
      order?.email?.toString().includes(searchTerm)
  );

  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.entriesPerPage,
    pagination.currentPage * pagination.entriesPerPage
  );

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const updateHandler = async (id, role) => {
    try {
      await updateUser({
        userId: id,
        userRole: role === "admin",
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="title text-animation">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="orders-table-container">
          <div className="table-controls">
            <div className="entries-per-page">
              <span>Show:</span>
              <select
                value={pagination.entriesPerPage}
                onChange={(e) =>
                  handleEntriesPerPageChange(Number(e.target.value))
                }
                className="form-control"
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>
            <div className="search-control">
              <label>Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="form-control"
              />
            </div>
          </div>

          <table className="order-table">
            <thead style={{ height: "4rem" }}>
              <tr>
                <th className="table-header">ID</th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("email")}
                >
                  NAME {getSortIcon("email")}
                </th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("username")}
                >
                  EMAIL {getSortIcon("username")}
                </th>
                <th className="table-header">PHONE NUMBER</th>
                <th className="table-header">GSTIN</th>
                <th className="table-header">USER ROLE</th>
                <th className="table-header">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">{user.id}</td>
                  <td className="table-cell">
                    <div className="d-flex align-items-center">
                      {user.username}{" "}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="d-flex align-items-center">
                      <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="d-flex align-items-center">
                      {user.phone}{" "}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="d-flex align-items-center">
                      {user.GSTIN}{" "}
                    </div>
                  </td>
                  <td className="table-cell">
                    <select
                      className="form-control"
                      value={user.isAdmin ? "admin" : "user"}
                      onChange={(e) => updateHandler(user.id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </td>

                  <td className="table-cell">
                    {!user.isAdmin && (
                      <div className="d-flex">
                        <button
                          onClick={() => deleteHandler(user.id)}
                          className="btn btn-danger"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(
              filteredData.length / pagination.entriesPerPage
            )}
            onPageChange={handlePageChange}
            entriesPerPage={pagination.entriesPerPage}
            totalEntries={filteredData.length}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;
