"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaUserAlt, FaCog, FaSignOutAlt } from "react-icons/fa";

interface DropDownMenuProps {
  loggedInUser: string;
  setCurrentView: (view: string) => void;
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ loggedInUser, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  function logoutHandler() {
    signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  }

  const userAdminHandler = () => {
    setCurrentView("User");
  };

  console.log(session?.user?.role);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-left text-gray-700 transition duration-150 ease-in-out border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
      >
        <FaUserAlt className="ml-2" /> <span className=" ps-4"> {loggedInUser}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="py-1">
            {/* <a href="#" className="flex items-center px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <FaUserAlt className="mr-3" />
              Profile
      </a>*/}
            {session?.user?.role.includes("Admin") && (
              <a href="#" onClick={userAdminHandler} className="flex items-center px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <FaCog className="mr-3" />
                Manage Users
              </a>
            )}
            <a href="#" onClick={logoutHandler} className="flex items-center px-4 py-2 text-sm border-0 leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <FaSignOutAlt className="mr-3" />
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
