import { useState } from "react";
import { hamburger } from "./assets/assets";

// 페이지 컴포넌트
const Home = () => <h1 className="text-3xl font-bold text-gray-900">홈</h1>;
const HtmlPage = () => (
  <h1 className="text-3xl font-bold text-gray-900">HTML & CSS</h1>
);
const JsPage = () => (
  <h1 className="text-3xl font-bold text-gray-900">JavaScript & TypeScript</h1>
);
const ReactPage = () => (
  <h1 className="text-3xl font-bold text-gray-900">React</h1>
);

const Wiki = () => {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-beige">
      {/* 사이드바 */}
      <nav
        className={`${
          sidebarOpen ? "w-64 p-4 opacity-100" : "w-0 p-0 opacity-0"
        } bg-gray-100 shadow-md  fixed h-full transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* 사이드바 내부의 햄버거 아이콘 (열렸을 때 위치) */}
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 z-50 p-2 transition-all duration-300"
          >
            <img src={hamburger} alt="hamburger" className="w-6" />
          </button>
        )}
        <h2
          className={`text-xl font-bold text-gray-800 mb-6 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
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
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-50 p-2 transition-all duration-300"
        >
          <img src={hamburger} alt="hamburger" className="w-6" />
        </button>
      )}

      <div className="flex flex-col overflow-hidden items-center justify-center flex-1">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">Wiki</h1>

          <input
            type="text"
            placeholder=""
            className="px-4 py-2 w-72 sm:w-96 border rounded-3xl border-gray-300"
          />
        </div>

        {/* 현재 선택된 페이지 출력 */}
        {/* <div className="mt-8 p-6 w-full max-w-2xl bg-white shadow-md rounded-lg text-center">
          {page === "home" && <Home />}
          {page === "htmlcss" && <HtmlPage />}
          {page === "jsts" && <JsPage />}
          {page === "react" && <ReactPage />}
        </div> */}
      </div>
    </div>
  );
};

export default Wiki;
