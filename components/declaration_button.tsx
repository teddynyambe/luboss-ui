// DeclarationButton.tsx
import React from "react";

interface Item {
  declaration_date: string; // Assuming dates are in ISO format (e.g., "2024-02-24")
}

interface DeclarationButtonProps {
  items: Item[];
  onSubmit: () => void;
}

const DeclarationButton: React.FC<DeclarationButtonProps> = ({ items, onSubmit }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const isDeclarationThisMonth = items.some((item) => {
    const declarationDate = new Date(item.declaration_date);
    return declarationDate.getFullYear() === currentYear && declarationDate.getMonth() === currentMonth;
  });

  if (isDeclarationThisMonth) {
    return null; // Don't display the button if an item has a declaration_date this month
  }

  return (
    <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={onSubmit}>
      Make Declaration
    </button>
  );
};

export default DeclarationButton;
