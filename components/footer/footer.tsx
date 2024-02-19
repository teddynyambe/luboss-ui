import React from 'react'

const AppFooter = () => {
  return (
    <div>
        <footer className="fixed bottom-0 left-0 w-full z-50 flex bg-white shadow-md p-1">
            <button className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out mr-1">Home</button>
            <button className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out mr-1" >Declaration</button>
            <button className="bg-blue-500 flex-grow text-white py-2 px-4 hover:bg-blue-900 active:scale-95 transition duration-150 ease-in-out" >Deposit</button>
        </footer>

    </div>
  )
}

export default AppFooter
