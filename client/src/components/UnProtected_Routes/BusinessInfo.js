const BusinessInfo = () => {
  const infoSections = [
    {
      title: "Nature of Business",
      content: "Trader - Retailer",
    },
    {
      title: "Annual Turnover",
      content: "0 - 40 L",
    },
    {
      title: "Total Number of Employees",
      content: "Upto 10 People",
    },
    {
      title: "IndiaMART Certification",
      content: "Trust Seal Verified",
    },
  ];

  return (
    <div className="business-info-container">
      <h2 className="title text-animation">About Us</h2>
      <p>
        Established in the year 2016, Sri Dhanvantari Exports has become one of
        the most prominent and leading suppliers and Exporters of Tapioca Starch
        Products products all over the world. In a short span of time, we have
        become renowned for very high client satisfaction. Our products score
        high in terms of quality but are cost-effective at the same time. The
        aroma, freshness, nutritional content and taste of our products are
        unbeatable.We believe in building international standards for innovation
        and providing quality in products services.
      </p>

      <div className="all-info-grid">
        {infoSections.map((section, index) => (
          <div key={index} className="info-item">
            <h4>{section.title}</h4>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessInfo;
