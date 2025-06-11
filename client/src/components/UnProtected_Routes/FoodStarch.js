const FoodStarch = () => {
   const parameters = [
    { name: "Content of Starch", unit: "%" },
    { name: "Moisture", unit: "%" },
    { name: "Foreign Matters", unit: "%" },
    { name: "Fiber", unit: "%" },
    { name: "Viscosity", unit: "BU" },
    { name: "pH", unit: "–" },
    { name: "Fineness (# 140)", unit: "%" },
    { name: "Whiteness", unit: "%" },
  ];
  return (
    <div>
      <div className="hero-section">
        <h2 className="title text-animation">
          Native Indian Tapioca Starch Powder
        </h2>
        <p>Premium Quality Cassava Starch</p>
      </div>

      <section>
        <h2 className="title">About Tapioca Starch</h2>
        <div>
          <p>
            Tapioca starch{" "}
            <span style={{ fontWeight: "var(--font-weight-bold)" }}>
              (Cassava starch)
            </span>{" "}
            is the main component of tapioca tubers. It is extracted from the
            tubers (roots) of the tapioca plant and is one of the major
            commercial starches in the global market, ranking second after corn
            starch.
          </p>
          <p>
            Tapioca starch{" "}
            <span style={{ fontWeight: "var(--font-weight-bold)" }}>
              (tapioca flour)
            </span>{" "}
            can be called by Cassava Starch in English or a familiar name that
            everyone knows is{" "}
            <span style={{ fontWeight: "var(--font-weight-bold)" }}>
              "Native Tapioca Starch"
            </span>{" "}
            – The type of flour that is used common daily use.
          </p>
          <p>
            In production applications, tapioca flour can be substituted with
            other starches extracted from: Corn, Potato, Wheat with similar
            biological and chemical properties.
          </p>
          <p>
            But with low economic cost, available raw materials in the country,
            plus not using genetically modified technology{" "}
            <span style={{ fontWeight: "var(--font-weight-bold)" }}>(GMO)</span>{" "}
            have made tapioca flour an indispensable raw material or additive in
            production industry.
          </p>
        </div>
      </section>

      <section>
        <h2 className="title">Characteristics of Tapioca Starch</h2>
        <div>
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

      <section>
        <h2 className="title">Packaging & Standards</h2>

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
            <p>
              Maniks AR b/o Sri Dhanvantari Exports
            </p>
          </div>
          <div className="info-item">
            <h4 >Place of Manufacture:</h4>
            <p>India (Tamilnadu,Salem)</p>
          </div>
          <div className="info-item">
            <h4 >International name:</h4>
            <p >
              Tapioca starch, Cassava starch, Manioc Starch
            </p>
          </div>
          <div className="info-item">
            <h4 >Packing:</h4>
            <p >30kg, 50kg.</p>
          </div>
          <div className="info-item">
            <h4 >Type of bag:</h4>
            <p >HDPE PP BAG.</p>
          </div>
          <div className="info-item">
            <h4 >Shelf life:</h4>
            <p >
              12 months (stored in a dry place)
            </p>
          </div>
          <div className="info-item">
            <h4 >Certification:</h4>
            <p className="info-value">
              Products Certificate of Analysis, FSSAI & APEDA membership
            </p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="title">Applications of Tapioca Starch</h2>
        <div>
          <p >
            Tapioca starch is extracted from cassava roots after being processed
            and separated by biochemical and physicochemical methods, it is not
            only used as a food material but also used as the main raw material
            of other products. Specific industries are as follows:
          </p>

          <div className="application-card">
            <h3 className="application-title">Daily Food</h3>
            <p>
              Tapioca Starch (Tapioca Starch) is used a lot in dry products such
              as rice paper, tapioca flour, vermicelli, noodles, farming.
            </p>
          </div>

          <div className="application-card">
            <h3 className="application-title">Food Industry</h3>
            <p>
              Used to produce instant noodles, alcohol, seasoning seeds, and
              main noodles.
            </p>
          </div>

          <div className="application-card">
            <h3 className="application-title">Paper Industry</h3>
            <p>
              Tapioca flour is used as a filler or a surface coating for some
              types of paper and cardboard with ashless ingredients.
            </p>
          </div>

          <div className="application-card">
            <h3 className="application-title">Textile Industry</h3>
            <p>Used in the sizing of fabrics.</p>
          </div>

          <div className="application-card">
            <h3 className="application-title">Construction Materials</h3>
            <p>
              Tapioca starch is applied in plaster ceiling panels, increasing
              the cohesion for clay, limestone, as an additive to paints.
            </p>
          </div>

          <div className="application-card">
            <h3 className="application-title">Pharmaceutical & Cosmetics</h3>
            <p>
              Tapioca starch is used as a whitening powder, a filler in
              pharmaceuticals, and to create a colloidal film in some cosmetics.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="title">Related Products</h2>
        <div  className="product-cards">
          <div className="product-card">
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
            <h4 className="product-title">Sago Broken Flour</h4>
            <p >
              Sago Broken Flour is a gluten-free, grain-free starch that can be
              used in Namkeen, Crunches, baking, mixed with water, or added to
              desserts. But it has very little protein and few vitamins and
              minerals.
            </p>
          </div>

          <div className="product-card">
            <h4 className="product-title">Native Potato Starch Powder</h4>
            <p >
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
