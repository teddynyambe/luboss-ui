import React from "react";
import DeclarationForm from "./declaration_form";
import RegistrationForm from "./registration_form";

const Modal = ({ isOpen, onClose, onSubmit, itemData, currentView }) => {
  if (!isOpen) return null;
  console.log("Item Data is: ");
  console.log(itemData);

  return (
    <div className="">
      {currentView === "declaration" && <DeclarationForm onClose={onClose} onSubmit={onSubmit} itemData={itemData} />}
      {currentView === "member" && <RegistrationForm selectedUser={itemData} onClose={onClose} />}
    </div>
  );
};

export default Modal;
