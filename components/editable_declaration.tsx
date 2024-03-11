import React from "react";

interface EditableDeclarationProps {
  declaration_date: string; // Assuming the date is provided as a string
  onSubmit: () => void;
  itemData: object;
}

const EditableDeclaration: React.FC<EditableDeclarationProps> = ({ declaration_date, onSubmit, itemData }) => {
  const isEditable = (): boolean => {
    const currentDate = new Date();
    const declarationDate = new Date(declaration_date);

    // Check if the declaration date is within the current month
    const isCurrentMonth = declarationDate.getMonth() === currentDate.getMonth() && declarationDate.getFullYear() === currentDate.getFullYear();

    // Check if the declaration date is not later than the 25th
    const isBefore25th = declarationDate.getDate() <= 29;

    return isCurrentMonth && isBefore25th;
  };

  return (
    <>
      {isEditable() && (
        <span className="flex float-end">
          <a href="#" onClick={() => onSubmit(itemData)}>
            Edit
          </a>
        </span>
      )}
    </>
  );
};

export default EditableDeclaration;
