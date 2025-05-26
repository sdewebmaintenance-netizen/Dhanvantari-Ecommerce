const formatDate = (date) => {
  const paidAt = new Date(date);
  return paidAt.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",  
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default formatDate;
