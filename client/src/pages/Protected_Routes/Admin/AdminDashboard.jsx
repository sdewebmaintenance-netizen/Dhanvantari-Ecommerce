import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import Loader from "../../../components/Common/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  console.log("sahflb", salesDetail, sales, customers, orders);

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line"   
      },
      tooltip: {
        mode: "light",
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      colors: ["#323145"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail && Array.isArray(salesDetail)) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: new Date(item.date).toLocaleDateString(), // nicely formatted
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <section>
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"> ₹</div>
          <p className="stat-label">Sales</p>
          <h1 className="stat-value">
            ₹ {isLoading ? <Loader /> : sales?.totalSales?.toFixed(2)}
          </h1>
        </div>
        <div className="stat-card">
          <div className="stat-icon"> ₹</div>
          <p className="stat-label">Customers</p>
          <h1 className="stat-value">
            {loading ? <Loader /> : customers?.length}
          </h1>
        </div>
        <div className="stat-card">
          <div className="stat-icon"> ₹</div>
          <p className="stat-label">All Orders</p>
          <h1 className="stat-value">
            {loadingTwo ? <Loader /> : orders?.totalOrders}
          </h1>
        </div>
      </div>

      <div className="chart-container">
        <Chart
          options={state.options}
          series={state.series}
          type="bar"
          width="100%"
        />
      </div>
    </section>
  );
};

export default AdminDashboard;
