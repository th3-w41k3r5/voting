import React from 'react';

const Modal = ({ message, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default Modal;
