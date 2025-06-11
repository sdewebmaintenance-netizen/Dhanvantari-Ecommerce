const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop"></div>
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={onClose}
            >
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;