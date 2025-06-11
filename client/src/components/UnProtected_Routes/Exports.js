import React, { useState } from "react";

const tabsData = {
  Industrial: [
    {
      name: "Double Refined Sugar",
      variant: "India",
      desc: null,
    },
    {
      name: "Pharma Sugar",
      variant: "India",
      desc: "Free flowing, white crystalline pharma grade powder, free from heavy metals and extraneous matter",
    },
    {
      name: "Plantation White Sugar",
      variant: "India",
      desc: null,
    },
  ],
  Retail: [
    {
      name: "Brown Sugar Cubes",
      variant: "India",
      desc: "SDE’s brown sugar cubes are made from natural cane sugar and retain molasses for depth of flavor. Ideal for cafes, hotels, and export markets seeking a premium touch in beverage service.",
    },
    {
      name: "White Sugar Cubes",
      variant: "India",
      desc: "SDE's white sugar cubes are made from high-purity refined cane sugar and molded into consistent cubes for portion control. Widely used in hotels, airlines, and premium beverage service.",
    },
  ],
  "Confectionery & Beverages": [
    {
      name: "Icing Sugar",
      variant: "India",
      desc: "SDE's icing sugar is a finely ground, anti-caking sugar used widely in baking and confectionery. It ensures smooth textures, easy blending, and elegant presentation.",
    },
    {
      name: "Invert Sugar",
      variant: "India",
      desc: "Higly soluble sweetener with additional benefits such as moisture retention & low product breakages",
    },
  ],
  Gourmet: [
    {
      name: "Demerara Brown Sugar",
      variant: "India",
      desc: "SDE's Demerara sugar is a premium-grade, coarse-textured brown sugar with a subtle molasses taste. It enhances appearance and flavor in gourmet applications like baking, cereals, and beverages.",
    },
  ],
};

const getAllProducts = () => Object.values(tabsData).flat();

const ProductQuoteTable = () => {
  const [activeTab, setActiveTab] = useState("All");

  const currentProducts =
    activeTab === "All" ? getAllProducts() : tabsData[activeTab];

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "All" ? "active" : ""}`}
          onClick={() => setActiveTab("All")}
        >
          All
        </button>
        {Object.keys(tabsData).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Variant</th>
            <th>Inco Term</th>
            <th>Port</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <tr key={index}>
              <td>
                <strong>{product.name}</strong>
                {product.desc && <div className="desc">{product.desc}</div>}
              </td>
              <td>{product.variant}</td>
              <td>
                <select className="form-control">
                  <option>FOB</option>
                  <option>CIF</option>
                </select>
              </td>
              <td>
                <select className="form-control">
                  <option>Santos - BR</option>
                  <option>Mumbai - IN</option>
                </select>
              </td>
              <td>
                <a href="#footer">
                  <button class="btn-customized">Request Quote</button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductQuoteTable;
