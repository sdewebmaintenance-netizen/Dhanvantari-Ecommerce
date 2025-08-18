import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import Loader from "../../../components/Common/Loader";
import { format, subDays } from "date-fns";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

   const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
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
      },
      colors: ["#323145"],
      dataLabels: {
        enabled: !isMobile,
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
        labels: {
          rotate: isMobile ? -45 : 0,
          hideOverlappingLabels: isMobile,
        },
      },
      yaxis: {
        title: {
          text: "Sales (₹)",
        },
        min: 0,
        labels: {
          formatter: function(value) {
            return "₹" + value.toFixed(0);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return "₹" + value.toFixed(2);
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

   useEffect(() => {
    if (salesDetail && Array.isArray(salesDetail)) {
      // Filter data based on selected time range
      let filteredData = [...salesDetail];
      const today = new Date();
      
      if (timeRange === "7days") {
        const date7DaysAgo = subDays(today, 7);
        filteredData = salesDetail.filter(item => 
          new Date(item.date) >= date7DaysAgo
        );
      } else if (timeRange === "30days") {
        const date30DaysAgo = subDays(today, 30);
        filteredData = salesDetail.filter(item => 
          new Date(item.date) >= date30DaysAgo
        );
      } else if (timeRange === "year") {
        const date1YearAgo = subDays(today, 365);
        filteredData = salesDetail.filter(item => 
          new Date(item.date) >= date1YearAgo
        );
      }

      // Format dates based on time range
      const formatDate = (date) => {
        const d = new Date(date);
        if (timeRange === "7days") return format(d, 'EEE');
        if (timeRange === "30days") return format(d, 'MMM dd');
        return format(d, 'MMM yyyy');
      };

      const formattedSalesDate = filteredData.map((item) => ({
        x: formatDate(item.date),
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
            labels: {
              ...prevState.options.xaxis.labels,
              rotate: isMobile ? -45 : 0,
              hideOverlappingLabels: isMobile,
            }
          },
          dataLabels: {
            enabled: !isMobile && filteredData.length < 20,
          }
        },
        series: [
          { name: "Sales (₹)", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail, timeRange, isMobile]);

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

      <div className="chart-controls">
        <button 
          className={`time-btn ${timeRange === "7days" ? "active" : ""}`}
          onClick={() => setTimeRange("7days")}
        >
          Last 7 Days
        </button>
        <button 
          className={`time-btn ${timeRange === "30days" ? "active" : ""}`}
          onClick={() => setTimeRange("30days")}
        >
          Last 30 Days
        </button>
        <button 
          className={`time-btn ${timeRange === "year" ? "active" : ""}`}
          onClick={() => setTimeRange("year")}
        >
          Last Year
        </button>
      </div>

      <div className="chart-container">
        <Chart
          options={state.options}
          series={state.series}
          type={isMobile ? "area" : "line"}
          width="100%"
          height={isMobile ? "300px" : "400px"}
        />
      </div>
    </section>
  );
};

export default AdminDashboard;
