"use client";

interface AppFooterProps {
  setCurrentView: (view: string) => void; // Example function prop
}

const AppFooter: React.FC<AppFooterProps> = ({ setCurrentView }) => {
  return (
    <>
      <div>
        <footer className="fixed bottom-0 left-0 w-full z-50 flex bg-white shadow-md p-1">
          <button onClick={() => setCurrentView("Home")} className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out mr-1">
            Home
          </button>
          <button onClick={() => setCurrentView("Declaration")} className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out mr-1">
            Declaration
          </button>
          <button onClick={() => setCurrentView("Deposit")} className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out mr-1">
            Deposit
          </button>
          <button onClick={() => setCurrentView("Loan")} className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out">
            Loan
          </button>
        </footer>
      </div>
    </>
  );
};

export default AppFooter;
