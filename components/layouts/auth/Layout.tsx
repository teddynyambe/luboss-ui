import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div>
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md p-2 bg-green-100">
          <div className="flex justify-center text-2xl text-green-700 ">LUBOSS-VB</div>
        </header>
      </div>
      <div className="mt-16">
        <div className="flex justify-center items-center m-10">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
