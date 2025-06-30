const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop"></div>
          <div className="modal-content">
            <div className="modal-close">
              <button onClick={onClose} className="modal-close-btn">X</button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
