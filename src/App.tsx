import { useState } from "react";
import { hamburger } from "./assets/assets";
import Html from "./components/Html";
import React from "./components/React";
import Jsts from "./components/Jsts";

const Wiki = () => {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-beige">
      <nav
        className={`${
          sidebarOpen ? "w-64 p-4 opacity-100" : "w-0 p-0 opacity-0"
        } bg-yellow-50 shadow-md fixed h-full transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* 사이드바 내부의 닫기 버튼 */}
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 z-50 p-2 transition-all duration-300"
          >
            <img src={hamburger} alt="hamburger" className="w-6" />
          </button>
        )}
        <h2
          className={`text-xl font-bold text-gray-800 mb-6 transition-opacity duration-300 cursor-pointer ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setPage("home")}
        >
          Wiki
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setPage("htmlcss")}
              className="block w-full text-left text-lg text-gray-800 hover:text-blue-500"
            >
              HTML & CSS
            </button>
          </li>
          <li>
            <button
              onClick={() => setPage("jsts")}
              className="block w-full text-left text-lg text-gray-800 hover:text-blue-500"
            >
              JS & TS
            </button>
          </li>
          <li>
            <button
              onClick={() => setPage("react")}
              className="block w-full text-left text-lg text-gray-800 hover:text-blue-500"
            >
              React
            </button>
          </li>
        </ul>
      </nav>

      {/* 사이드바 열기 버튼 (닫혀 있을 때만 표시) */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-50 p-2 transition-all duration-300"
        >
          <img src={hamburger} alt="hamburger" className="w-6" />
        </button>
      )}

      <div className="flex-1 p-6">
        {page === "home" && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Wiki</h1>
            <input
              type="text"
              className="px-4 py-2 w-72 sm:w-96 border rounded-3xl border-gray-300"
            />
          </div>
        )}
        {page === "htmlcss" && <Html />}
        {page === "jsts" && <Jsts />}
        {page === "react" && <React />}
      </div>
    </div>
  );
};

export default Wiki;
