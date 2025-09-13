// 'use client'
// import React from 'react'

// const Colors = () => {
//   return (
//     <div className='flex gap-2 items-center  justify-center mx-auto w-full h-[10rem] rounded-lg  min-h-screen '>
//         <div className='w-20 h-20 bg-[#ffffff1a] items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-white-100 items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-[#ffffff33] items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-[#212121] items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-[#0f0f0f] items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-[#0f0f0fb3] items-center justify-center flex'>e</div>
//         <div className='w-20 h-20 bg-[#000000] items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-[#00000099] items-center justify-center flex'>n</div>

//         {/* Text */}
//         <div className='w-20 h-20 bg-[#f1f1f1] items-center justify-center flex'>n</div>
//         <div className='w-20 h-20 bg-[#333333] items-center justify-center flex'>n</div>

//         <div className='border-2 border-[#ffffff33]'>n</div>
//         <div className='border-2 border-[#666666]'>n</div>
//     </div>
//   )
// }

// export default Colors

import { useState, useEffect, useRef } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative">
      {/* Open Sidebar Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-10 left-40 z-20 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        ☰ Open Sidebar
      </button>

      {/* Overlay (darkens background when sidebar is open) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          ✕
        </button>
        <nav className="mt-12">
          <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Home
          </a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Videos
          </a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Profile
          </a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Settings
          </a>
        </nav>
      </div>
    </div>
  );
}