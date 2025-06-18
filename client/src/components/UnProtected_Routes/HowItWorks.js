

const steps = [
  {
    icon: "🛒",
    title: "Book an Order",
    points: [
      "FOB, CFR rates available from verified Suppliers.",
      "Port missing? Ask for Rate!",
      "Large orders? Request a Quote",
    ],
  },
  {
    icon: "💵",
    title: "Confirm & Pay Advance",
    points: [
      "Supplier confirms along with digitally signed Sales Contract.",
      "Pay Advance",
    ],
  },
  {
    icon: "💬",
    title: "Monitor Progress",
    points: [
      "Real time Production and Shipment status with photos & videos.",
      "SDE managed Quality Control Reports.",
    ],
  },
  {
    icon: "📄",
    title: "Pay Balance",
    points: [
      "Receive Shipment Notifications.",
      "Pay Balance as per agreed Terms.",
      "Download Bill of Lading",
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
