import getImage from "../../Utils/GetImage";

import React from "react";
import {
  FaUtensils,
  FaIndustry,
  FaRegFileAlt,
  FaTshirt,
  FaHardHat,
  FaPills,
} from "react-icons/fa";

const FoodStarch = () => {
  const parameters = [
    { name: "Moisture", unit: "11.2 %" },
    { name: "Total Ash ", unit: "0.27 %" },
    { name: "Acid Insoluble Ash ", unit: "0.05 %" },
    { name: "Starch", unit: "99.57 %" },
    { name: "Protein", unit: "0.15 %" },
    { name: "Sulphur dioxide", unit: "20 ppm" },
    { name: "Crude fibre", unit: "0.01 %" },
    { name: "pH of aqueous extract", unit: "4.85" },
    { name: "Cold water solubles ", unit: "0.08 %" }
  ];

  return (
    <div className="food-starch-container">
      <div className="hero-section">
        <div className="hero-overlay">
          <h2>Native Indian Tapioca Starch Powder</h2>
          <p className="heroo-subtitle">Premium Quality Cassava Starch</p>
        </div>
      </div>

      <section className="content-section with-image">
        <div className="text-content">
          <h2 className="section-title">About Tapioca Starch</h2>
          <div className="section-content">
            <p>
              Tapioca starch{" "}
              <span className="highlight-text">(Cassava starch)</span> is the
              main component of tapioca tubers. It is extracted from the tubers
              (roots) of the tapioca plant and is one of the major commercial
              starches in the global market, ranking second after corn starch.
            </p>
            <p>
              Tapioca starch{" "}
              <span className="highlight-text">(tapioca flour)</span> can be
              called by Cassava Starch in English or a familiar name that
              everyone knows is{" "}
              <span className="highlight-text">"Native Tapioca Starch"</span> –
              The type of flour that is used common daily use.
            </p>
          </div>
        </div>
        <div className="image-content">
          <img
            src={getImage("Tapiaco_Starch.jpeg", "Web-bg")}
            alt="Tapioca roots"
            className="section-image"
          />
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Characteristics of Tapioca Starch</h2>
        <div className="section-content">
          <p>
            Tapioca starch – After being extracted from fresh cassava roots, on
            the outside, it exists in the form of a fine, white powder with the
            following outstanding internal features:
          </p>
          <ul className="feature-list">
            <li>
              Tapioca starch is difficult to gelatinize in water at many degrees
              of temperature or at low temperatures.
            </li>
            <li>
              At many altitudes or in alkaline environments, tapioca starch
              gelatinizes and forms a highly sticky, thick and flexible glue.
            </li>
            <li>Slows down the degradation of starch.</li>
            <li>Tapioca starch is unstable when cut</li>
          </ul>
          <p>
            With the above characteristics, tapioca starch is widely used in
            thickeners, thickeners or surface glue coatings in industries.
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Packaging & Standards</h2>

        <div className="image-gallery">
          <img
            src={getImage("Sago_Starch.png", "Web-bg")}
            alt="Tapioca starch powder"
            className="gallery-image"
          />
          <img
            src={getImage("Maize_Starch2.jpg", "Web-bg")}
            alt="Starch packaging"
            className="gallery-image"
          />
        </div>

        <table className="parameter-table">
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index}>
                <td>{param.name}</td>
                <td>{param.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="all-info-grid">
          <div className="info-item">
            <h4>Brand:</h4>
            <p>Maniks AR b/o Sri Dhanvantari Exports</p>
          </div>
          <div className="info-item">
            <h4>Place of Manufacture:</h4>
            <p>India (Tamilnadu,Salem)</p>
          </div>
          <div className="info-item">
            <h4>International name:</h4>
            <p>Tapioca starch, Cassava starch, Manioc Starch</p>
          </div>
          <div className="info-item">
            <h4>Packing:</h4>
            <p>30kg, 50kg.</p>
          </div>
          <div className="info-item">
            <h4>Type of bag:</h4>
            <p>HDPE PP BAG.</p>
          </div>
          <div className="info-item">
            <h4>Shelf life:</h4>
            <p>12 months (stored in a dry place)</p>
          </div>
          <div className="info-item">
            <h4>Certification:</h4>
            <p>Products Certificate of Analysis, FSSAI & APEDA membership</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Applications of Tapioca Starch</h2>
        <div className="section-content">
          <p>
            Tapioca starch is extracted from cassava roots after being processed
            and separated by biochemical and physicochemical methods, it is not
            only used as a food material but also used as the main raw material
            of other products. Specific industries are as follows:
          </p>

          <div className="applications-grid">
            <div className="applications-card">
              <div className="app-icon-container">
                <FaUtensils
                  className="app-icon"
                  size={48}
                  aria-label="Daily food"
                  color="#4e474a"
                />
              </div>
              <h3 className="application-title">Daily Food</h3>
              <p>
                Tapioca Starch (Tapioca Starch) is used a lot in dry products
                such as rice paper, tapioca flour, vermicelli, noodles, farming.
              </p>
            </div>

            <div className="applications-card">
              <div className="app-icon-container">
                <FaIndustry
                  className="app-icon"
                  size={48}
                  aria-label="Food industry"
                  color="#4e474a"
                />
              </div>
              <h3 className="application-title">Food Industry</h3>
              <p>
                Used to produce instant noodles, alcohol, seasoning seeds, and
                main noodles.
              </p>
            </div>

            <div className="applications-card">
              <div className="app-icon-container">
                <FaRegFileAlt
                  className="app-icon"
                  size={48}
                  aria-label="Paper industry"
                  color="#4e474a"
                />
              </div>
              <h3 className="application-title">Paper Industry</h3>
              <p>
                Tapioca flour is used as a filler or a surface coating for some
                types of paper and cardboard with ashless ingredients.
              </p>
            </div>

            <div className="applications-card">
              <div className="app-icon-container">
                <FaTshirt
                  className="app-icon"
                  size={48}
                  aria-label="Textile industry"
                  color="#4e474a"
                />
              </div>
              <h3 className="application-title">Textile Industry</h3>
              <p>Used in the sizing of fabrics.</p>
            </div>

            <div className="applications-card">
              <div className="app-icon-container">
                <FaHardHat
                  className="app-icon"
                  size={48}
                  aria-label="Construction"
                  color="#4e474a"
                />
              </div>
              <h3 className="application-title">Construction Materials</h3>
              <p>
                Tapioca starch is applied in plaster ceiling panels, increasing
                the cohesion for clay, limestone, as an additive to paints.
              </p>
            </div>

            <div className="applications-card">
              <div className="app-icon-container">
                <FaPills
                  className="app-icon"
                  size={48}
                  aria-label="Pharmaceutical"
                  color="#4e474a"
                />
              </div>
              <h3 className="application-title">Pharmaceutical & Cosmetics</h3>
              <p>
                Tapioca starch is used as a whitening powder, a filler in
                pharmaceuticals, and to create a colloidal film in some
                cosmetics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Related Products</h2>
        <div className="product-cards">
          <div className="product-card">
            <div className="product-image-container">
              <img
                src={getImage("Tapiaco_Thippu.jpg", "Web-bg")}
                alt="Tapioca Thippi Flour"
                className="product-image"
              />
            </div>
            <h4 className="product-title">Tapioca Thippi Flour</h4>
            <p>
              Tapioca flour, also known as tapioca starch, is a starchy white
              flour that has a slight sweet flavor to it. Tapioca flour is an
              alternative to traditional wheat flours and has a variety of uses
              in baking. The flour is made from the starch extracted from the
              South Indian cassava plant.
            </p>
          </div>

          <div className="product-card">
            <div className="product-image-container">
              <img
                src={getImage("Sago_Starch_1.jpeg", "Web-bg")}
                alt="Sago Broken Flour"
                className="product-image"
              />
            </div>
            <h4 className="product-title">Sago Broken Flour</h4>
            <p>
              Sago Broken Flour is a gluten-free, grain-free starch that can be
              used in Namkeen, Crunches, baking, mixed with water, or added to
              desserts. But it has very little protein and few vitamins and
              minerals.
            </p>
          </div>

          <div className="product-card">
            <div className="product-image-container">
              <img
                src={getImage("Potato_Starchs.jpeg", "Web-bg")}
                alt="Native Potato Starch Powder"
                className="product-image"
              />
            </div>
            <h4 className="product-title">Native Potato Starch Powder</h4>
            <p>
              Potato starch is the extracted starch from potatoes. The starch
              turns to a light, powdery, flour-like consistency once it has
              dried out, and it is a common ingredient that features in several
              recipes. To make potato starch, a person crushes raw potatoes,
              which separates the starch grains from the destroyed cells.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodStarch;
