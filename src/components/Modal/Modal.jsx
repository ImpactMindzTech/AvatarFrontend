function Modal({ title, children, onClose, isVisible }) {
    if (!isVisible) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{title}</h2>
          <div className="modal-body">{children}</div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  
  export default Modal;
  