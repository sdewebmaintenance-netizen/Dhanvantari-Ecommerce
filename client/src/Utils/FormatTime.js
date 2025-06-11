const formatTime = (date) => {
  const d = new Date(date);
  let [time, modifier] = d
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .split(" ");
  
  return `${time} ${modifier.toUpperCase()}`;
};

export default formatTime;
