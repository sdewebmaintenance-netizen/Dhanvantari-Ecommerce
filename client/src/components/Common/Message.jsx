const Message = ({ variant, children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "message-success";
      case "danger":
        return "message-danger";
      default:
        return "message-default";
    }
  };

  return <div className={`message ${getVariantClass()}`}>{children}</div>;
};

export default Message;