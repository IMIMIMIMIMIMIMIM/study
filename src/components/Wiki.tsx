import { useState, useEffect } from "react";
import { hamburger } from "../assets/assets";
import Html from "./Html";
import React from "./React";
import Jsts from "./Jsts";
import { useNavigate } from "react-router-dom";

const Wiki = () => {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<
    { title: string; page: string }[]
  >([]);
  const [sections, setSections] = useState<{ title: string; page: string }[]>(
    []
  );
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (page !== "home") {
      // 현재 페이지에서 h2 태그 가져와서 자동으로 섹션 리스트 생성
      setTimeout(() => {
        const headings = Array.from(document.querySelectorAll("h2"));
        const newSections = headings.map((heading) => ({
          title: heading.textContent || "제목 없음",
          page,
        }));
        setSections(newSections);
      }, 200);
    }
  }, [page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      setSuggestions(
        sections.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSelectSuggestion = (item: { title: string; page: string }) => {
    setSearch(item.title);
    setSuggestions([]);
    setPage(item.page);
    navigate(`/${item.page}?section=${encodeURIComponent(item.title)}`);
  };

  return (
    <div className="min-h-screen flex bg-beige">
      <nav
        className={`${
          sidebarOpen ? "w-64 p-4 opacity-100" : "w-0 p-0 opacity-0"
        } bg-yellow-50 shadow-md fixed h-full transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 z-50 p-2 transition-all duration-300"
          >
            <img src={hamburger} alt="hamburger" className="w-6" />
          </button>
        )}
        <h2
          className={`text-xl font-bold text-gray-800 mb-6 cursor-pointer ${
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
            <div className="relative w-72 sm:w-96">
              <input
                type="text"
                className="px-4 py-2 w-full border rounded-3xl border-gray-300"
                placeholder="검색어를 입력하세요"
                value={search}
                onChange={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1">
                  {suggestions.map((item) => (
                    <li
                      key={item.title}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
