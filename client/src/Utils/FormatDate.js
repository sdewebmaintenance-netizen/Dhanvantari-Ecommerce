const formatDate = (date) => {
  const paidAt = new Date(date);
  return paidAt.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",  
    year: "numeric",
  });
};

export default formatDate;