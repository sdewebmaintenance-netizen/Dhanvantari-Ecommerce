import React from "react";
import {
  FaUserCheck,
  FaTruck,
  FaFlag,
  FaChartLine,
  FaBuilding,
} from "react-icons/fa";
import getImage from "../../Utils/GetImage";

const stats = [
  {
    icon: <FaUserCheck />,
    value: "150+",
    label: "verified suppliers",
    className: "top-left",
  },
  {
    icon: <FaFlag />,
    value: "15+",
    label: "Countries Served",
    className: "bottom-left",
  },
  {
    icon: <FaTruck />,
    value: "5000 MT",
    label: "Delivered",
    className: "top-right",
  },
  {
    icon: <FaChartLine />,
    value: "~20%",
    label: "Cost saved for buyers",
    className: "bottom-center",
  },
];

const GlobalStats = () => {
  return (
    <div className="global-stats-container">
        <h2 className="title" style={{marginTop:"1rem"}}>Our Global Reach</h2>
      <div className="globe-background">
        <img src={getImage("globe.png")} alt="Globe" className="globe" />
      </div>
      {stats.map((stat, index) => (
        <div key={index} className={`stat-box ${stat.className}`}>
          <div className="icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="value">{stat.value}</div>
            <div className="label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlobalStats;
