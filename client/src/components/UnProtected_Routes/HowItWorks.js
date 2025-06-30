

const steps = [
  {
    icon: "🛒",
    title: "Book an Order",
    points: [
      "Product rates available for Customers below to book order online kindly mention preferred Shipping company and Delivery address with Pincode"
    ],
  },
  {
    icon: "💵",
    title: "Pay advance and receive invoice",
    points: [
      "Once order confirmed and payment received at our end SDE share Sales Invoice to Customer",
    ],
  },
  {
    icon: "💬",
    title: "Monitor Progress",
    points: [
      "Once Amount credited SDE ships Bags next day and Shares Transport Receipt to Customers in Wats app or Email for Tracking",
    ],
  },
  {
    icon: "📄",
    title: "Customers Get Delivery",
    points: [
      "Track the consignment in official website with LR number and once  Delivery call received or Status moved from Transit to 'Material reached final destination' Customer can produce identify proof and get the Product delivered in Nearest Warehouse.",
      "For Door Delivery inform us While Booking order.",
    ],
  },
];

const HowItWorks = () => {
  return (
    <section style={{marginBottom:"2rem"}}>
      <h2 className="title">How SDE Works</h2>
      <p>B2B and B2C purchase keeping your needs in mind</p>
      <div className="steps">
        {steps.map((step, index) => (
          <div className="step" key={index}>
            <div className="icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <ul>
              {step.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
