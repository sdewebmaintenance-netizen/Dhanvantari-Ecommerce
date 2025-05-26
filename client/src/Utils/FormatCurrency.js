const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = Number(amount);
  }

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default formatCurrency;