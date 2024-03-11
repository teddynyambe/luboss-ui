"use client";
import { useSession } from "next-auth/react";
import React from "react";
import DropdownMenu from "../NavMenu";
import { User } from "next-auth";

interface AppHeaderProps {
  setCurrentView: (view: string) => void;
}
const AppHeader: React.FC<AppHeaderProps> = ({ setCurrentView }) => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md p-4 bg-green-100">
          <div className="float-start text-2xl text-green-700">LUBOSS-VB</div>
          <div className="float-end text-green-900">
            <DropdownMenu loggedInUser={session?.user?.member?.first_name ?? ""} setCurrentView={setCurrentView} />
          </div>
        </header>
      </div>
    );
  } else {
    return <div>Session not set: {session}</div>;
  }
};

export default AppHeader;
