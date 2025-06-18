import { useEffect, useState } from "react";
import Message from "../../../components/Common/Message";
import Loader from "../../../components/Common/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../../redux/api/orderApiSlice";
import getImage from "../../../Utils/GetImage";
import PaginationControls from "../../../Utils/PaginationControls";
import { IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";
import formatCurrency from "../../../Utils/FormatCurrency";
import formatDate from "../../../Utils/FormatDate";

const UserOrder = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    entriesPerPage: 10,
    totalEntries: orders.length,
  });

  useEffect(() => {
    if (orders) {
      setPagination((prev) => ({
        ...prev,
        totalEntries: orders.length,
      }));
    }
  }, [orders]);

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
    if (!sortConfig.key) return orders;

    return [...orders].sort((a, b) => {
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
      order.id.toString().includes(searchTerm) ||
      order.totalPrice.toString().includes(searchTerm)
  );

  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.entriesPerPage,
    pagination.currentPage * pagination.entriesPerPage
  );

  return (
    <div className="user-orders-container">
      <h2 className="title text-animation">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
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
                placeholder="Search orders by price..."
                className="form-control"
              />
            </div>
          </div>

          <table className="orders-table">
            <thead style={{ height: "4rem" }}>
              <tr>
                <th className="table-header">Image</th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("id")}
                >
                  ID {getSortIcon("id")}
                </th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("createdAt")}
                >
                  Date {getSortIcon("createdAt")}
                </th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("totalPrice")}
                >
                  Total {getSortIcon("totalPrice")}
                </th>
                <th className="table-header">Paid</th>
                <th className="table-header">Delivered</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((order) => (
                <tr key={order.id} className="table-row">
                  <td className="order-table-cell">
                    <img
                      src={getImage(order?.orderItems[0]?.image, "ProductImage")}
                      alt={order.user}
                      className="order-item-image"
                    />
                  </td>
                  <td className="order-table-cell">{order.id}</td>
                  <td className="order-table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="order-table-cell">
                    {formatCurrency(order.totalPrice)}
                    
                  </td>
                  <td className="order-table-cell">
                    <span
                      className={`status-badge ${
                        order.isPaid ? "status-completed" : "status-pending"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="order-table-cell">
                    <span
                      className={`status-badge ${
                        order.isDelivered
                          ? "status-completed"
                          : "status-pending"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="order-table-cell">
                    <Link to={`/order/${order.id}`} className="btn-customized">
                      View Details
                    </Link>
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

export default UserOrder;
