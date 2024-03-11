import React, { useCallback, useEffect, useState } from "react";
import DeclarationForm from "../forms/declaration_form";
import Modal from "../forms/modal";
import { headers } from "next/headers";
import { useSession } from "next-auth/react";
import DateTimeDisplay from "../DateTime";
import EditableDeclaration from "../editable_declaration";
import DeclarationButton from "../declaration_button";

const DeclarationComponent = () => {
  const [memberTotal, setMemberTotal] = useState(0);
  const [groupTotalDeclaration, setGroupTotalDeclaration] = useState(0);
  const [openSection, setOpenSection] = useState(null);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [items_all, setItems_all] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const { data: session } = useSession();

  const memberId = session?.user?.member?.member_id;
  const url = `http://127.0.0.1:8000/api/declarations`;

  const handleNewDeclaration = () => {
    fetchItems();
    fetchItems_all();
  };

  const sumUpDeclaration = (item) => {
    return parseFloat(item.admin_fee_amount) + parseFloat(item.interest_amount) + parseFloat(item.loan_repayment_amount) + parseFloat(item.saving_amount) + parseFloat(item.social_fund_amount);
  };

  // Fetch All declaration
  const fetchItems_all = useCallback(async () => {
    const response = await fetch(url + "/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + session?.user?.token,
        member: memberId,
      },
    });
    const data = await response.json();
    setItems_all(data);
  }, [memberId, session, url]);

  useEffect(() => {
    //All Declarations

    fetchItems_all();
  }, [fetchItems_all]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + session?.user?.token,
          member: memberId,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  }, [memberId, session, url]);

  useEffect(() => {
    // Function to fetch items from your API
    fetchItems();
  }, [fetchItems]);

  //Calculate the total declarations for member
  useEffect(() => {
    if (items.length > 0) {
      const totalDeclarations = items.reduce((total, item) => {
        console.log("Declaration for: " + items.saving_amount);
        return total + Number(item.saving_amount) + Number(item.social_fund_amount) + Number(item.admin_fee_amount) + Number(item.interest_amount) + Number(item.loan_repayment_amount);
      }, 0);
      setMemberTotal(totalDeclarations); // Directly set the calculated total
    }
  }, [items]); // Recalculate when items change

  //Calculate the total declarations for all
  useEffect(() => {
    if (items_all.length > 0) {
      const totalDeclarations = items_all.reduce((total, item) => {
        return total + Number(item.saving_amount) + Number(item.social_fund_amount) + Number(item.admin_fee_amount) + Number(item.interest_amount) + Number(item.loan_repayment_amount);
      }, 0);
      setGroupTotalDeclaration(totalDeclarations); // Directly set the calculated total
    }
  }, [items_all]);

  const toggleSection = (sectionName) => {
    if (openSection === sectionName) {
      setOpenSection(null);
    } else {
      setOpenSection(sectionName);
    }
  };

  const handleOpenModalWindow = (item) => {
    console.log("Modal window: " + item.saving_amount);
    setItem(item);
    handleOpenModal();
  };
  return (
    <>
      <div className="text-center font-bold mb-2">Declarations</div>
      <DeclarationButton items={items} onSubmit={handleOpenModal} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleNewDeclaration} itemData={item} currentView={"declaration"} />
      <div className="flex flex-col w-full">
        {/* My Declarations Section */}
        <div className="border-b">
          <button className="py-2 px-4 pb-2 w-full text-left font-semibold bg-green-600 hover:bg-green-500 rounded-t-lg" onClick={() => toggleSection("myDeclarations")}>
            <span>My Declarations</span>
            <span className="flex float-end">{new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(memberTotal)}</span>
          </button>
          {openSection === "myDeclarations" && (
            <div className="p-1">
              {/* Content for My Declarations */}
              <ul>
                {items.map((item, index) => (
                  <li key={index} className={`flex p-1 ${index % 2 === 0 ? "bg-blue-400" : ""}`}>
                    <span className="flex-grow">
                      <DateTimeDisplay customDate={item.declaration_date} formatOptions={{ year: "numeric", month: "long" }} />
                    </span>

                    <span className="flex-grow text-right">{new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(sumUpDeclaration(item))}</span>
                    <span className="flex-grow">
                      <EditableDeclaration declaration_date={item.declaration_date} onSubmit={handleOpenModalWindow} itemData={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Other Members' Declarations Section */}
        <div className="border-b">
          <button className="py-2 px-4 w-full text-left font-semibold bg-green-600 rounded-t-lg hover:bg-green-500" onClick={() => toggleSection("otherMembersDeclarations")}>
            <span>Other Members Declarations</span>
            <span className="flex float-end">{new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(groupTotalDeclaration)}</span>
          </button>

          {openSection === "otherMembersDeclarations" && (
            <div className="p-2">
              <ul>
                {items_all.map((item, index) => (
                  <li key={index} className={`flex p-1 ${index % 2 === 0 ? "bg-blue-400" : ""}`}>
                    <span className="flex-grow">
                      {item.member_last_name}, {item.member_first_name[0]}
                    </span>
                    <span className="flex-grow">
                      <DateTimeDisplay customDate={item.declaration_date} formatOptions={{ year: "numeric", month: "long" }} />
                    </span>
                    <span className="flex flex-grow justify-end">{new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(sumUpDeclaration(item))}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // return (

  //   <div>
  //     <DeclarationForm />
  //   </div>
  // );
};

export default DeclarationComponent;
