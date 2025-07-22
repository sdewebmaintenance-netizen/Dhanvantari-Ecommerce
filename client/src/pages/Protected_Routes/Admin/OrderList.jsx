import { useEffect, useState } from "react";
import Message from "../../../components/Common/Message";
import Loader from "../../../components/Common/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../../redux/api/orderApiSlice";
import PaginationControls from "../../../Utils/PaginationControls";
import { IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";
import getImage from "../../../Utils/GetImage";
import formatCurrency from "../../../Utils/FormatCurrency";
import formatDate from "../../../Utils/FormatDate";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    entriesPerPage: 10,
    totalEntries: orders?.length,
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

    if (!orders) return []; 

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
      order?.id.toString().includes(searchTerm) ||
      order?.totalPrice.toString().includes(searchTerm)
  );

  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.entriesPerPage,
    pagination.currentPage * pagination.entriesPerPage
  );

  console.log("Sss", isLoading)

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message> 
      ) : (
        <>
        <h1 className="title text-animation">Orders List</h1>
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

          <table className="order-table">
            <thead style={{ height: "4rem" }}>
              <tr>
                <th className="table-header">ITEMS</th>
                <th className="table-header">USER</th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("createdAt")}
                >
                  DATE {getSortIcon("createdAt")}
                </th>
                <th
                  className="table-header sortable"
                  onClick={() => requestSort("totalPrice")}
                >
                  TOTAL {getSortIcon("totalPrice")}
                </th>
                <th className="table-header">PAID</th>
                <th className="table-header">DELIVERED</th>
                <th className="table-header"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((order) => (
                <tr key={order.id} className="table-row">
                  <td className="table-cell">
                    <img
                      src={order.orderItems[0].image_url}
                      alt={order.id}
                      className="order-item-image"
                    />
                  </td>

                  <td className="table-cell">
                    {order.OrderUser ? order.OrderUser.username : "N/A"}
                  </td>

                  <td className="table-cell">
                    {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                  </td>

                  <td className="table-cell">
                    {formatCurrency(order.totalPrice)}
                  </td>

                  <td className="table-cell">
                    {order.isPaid ? (
                      <span className="status-badge status-completed">
                        Completed
                      </span>
                    ) : (
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="table-cell">
                    {order.isDelivered ? (
                      <span className="status-badge status-completed">
                        Completed
                      </span>
                    ) : (
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="table-cell">
                    <Link to={`/order/${order.id}`}>
                      <button className="btn btn-outline">More</button>
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
        </>
      )}
    </>
  );
};

export default OrderList;
