import GlobalStats from "./GlobalStats";
import Certifications from "./Certifications";

const BusinessInfo = () => {
  const highlights = [
    {
      title: "Delivered",
      content: "5000 Orders",
    },
    {
      title: "Verified Suppliers",
      content: "10 Nos",
    },
    {
      title: "Quality Rejects",
      content: "0 %",
    },
    {
      title: "Cost Saved for Buyers",
      content: "20 PCT",
    },
  ];

  return (
    <div className="business-info-container">
      <h2 className="title">
        Native Food Ingredients Supply for Retail, Wholesale & Overseas
        Manufacturers.{" "}
      </h2>
      <p>
        Digital Tech Platform for Buying Food Starch within India & Abroad.{" "}
      </p>
      <br />

      <h2 className="title text-animation">Why SDE?</h2>
      <p>
        Native Food Ingredients Supply for Retail, Wholesale & Overseas
        Manufacturers.One stop starch sourcing solution from India. Power your
        business with a modern sourcing backbone. Solving disparity in price
        difference between states — Get the same wholesale price as you pay from
        manufacturer.
        <br />
        <br />
        <strong>Be ready for the digital tomorrow:</strong> Our operations are
        fully digitized with real-time track and trace visibility of order
        placements, quality checks, and logistics.
      </p>

      <div className="all-info-grid">
        {highlights.map((item, index) => (
          <div key={index} className="info-item">
            <h4>{item.content}</h4>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <GlobalStats />
      <Certifications />
    </div>
  );
};

export default BusinessInfo;
