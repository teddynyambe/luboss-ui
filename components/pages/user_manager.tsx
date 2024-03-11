import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../forms/modal";
import { API_URI } from "../constants";

const UserManagerComponent = () => {
  const url = `${API_URI}/api/members`;
  const [users, setUsers] = useState([]);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: session } = useSession();

  const fetchMembers = useCallback(async () => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + session?.user?.token,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  }, [session, url]);

  // Handle callback when user updated
  const handleEditMember = () => {
    fetchMembers();
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleEdit = (user) => {
    console.log("Edit member with ID:", user.first_name);
    setSelectedUser(user);
    handleOpenModal();
  };

  return (
    <div>
      <div className="text-center font-bold">User Manager</div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleEditMember} itemData={selectedUser} currentView={"member"} />
      <div>
        <ul>
          {users.map((user) => (
            <li key={user.member_id} className="flex justify-between items-center py-2">
              <span>
                {user.first_name} {user.last_name}
              </span>
              <button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagerComponent;
