import { useState, useEffect } from "react";
import { hamburger } from "../assets/assets";
import Html from "./Html";
import Jsts from "./Jsts";
import { useNavigate, useLocation } from "react-router-dom";
import htmlData from "../assets/data/HtmlData.json";
import jsData from "../assets/data/JsData.json";
import reactData from "../assets/data/ReactData.json";
import Search from "./Search";
import React from "./React";

const Wiki = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sections, setSections] = useState<{ title: string; page: string }[]>(
    []
  );

  const allSections = [
    ...htmlData.map((item) => ({ title: item.title, page: "htmlcss" })),
    ...jsData.map((item) => ({ title: item.title, page: "jsts" })),
    ...reactData.map((item) => ({ title: item.title, page: "react" })),
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sectionTitle = params.get("section");
  const currentPath = location.pathname.replace("/", "") || "home";

  // 섹션 파라미터가 있을 때 해당 섹션으로 스크롤
  useEffect(() => {
    const section = document.getElementById(sectionTitle || "");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [sectionTitle]);

  const isMobile = window.innerWidth < 768;

  const handleSelectSuggestion = (item: { title: string; page: string }) => {
    navigate(`/${item.page}?section=${encodeURIComponent(item.title)}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const goToPage = (name: string) => {
    navigate(`/${name}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const selectMenu = (name: string) =>
    `block w-full text-left ${currentPath === name ? "font-bold" : ""}`;

  return (
    <div className="min-h-screen flex bg-beige overflow-hidden">
      <nav
        className={`${
          sidebarOpen ? "w-64 p-4 opacity-100 z-10" : "w-0 p-0 opacity-0"
        } 
          bg-yellow-50 shadow-md fixed h-full transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2"
          >
            <img src={hamburger} alt="hamburger" className="w-6" />
          </button>
        )}
        <h2
          className="text-2xl font-bold inline-block text-gray-800 mb-6 cursor-pointer"
          onClick={() => {
            navigate("/wiki");
            setSections(allSections);
            setSidebarOpen(false);
          }}
        >
          Wiki
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => goToPage("htmlcss")}
              className={selectMenu("htmlcss")}
            >
              HTML & CSS
            </button>
          </li>
          <li>
            <button
              onClick={() => goToPage("jsts")}
              className={selectMenu("jsts")}
            >
              JS & TS
            </button>
          </li>
          <li>
            <button
              onClick={() => goToPage("react")}
              className={selectMenu("react")}
            >
              React
            </button>
          </li>
        </ul>
      </nav>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2"
        >
          <img src={hamburger} alt="hamburger" className="w-6" />
        </button>
      )}

      <div className="flex-1 p-6 flex">
        {currentPath === "wiki" && (
          <div className="flex flex-col items-center justify-center flex-1">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Wiki</h1>
            <Search
              allSections={allSections}
              onSelect={handleSelectSuggestion}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        )}
        {currentPath === "htmlcss" && (
          <Html
            allSections={allSections}
            targetSection={sectionTitle}
            handleSelectSuggestion={handleSelectSuggestion}
          />
        )}
        {currentPath === "jsts" && (
          <Jsts
            allSections={allSections}
            targetSection={sectionTitle}
            handleSelectSuggestion={handleSelectSuggestion}
          />
        )}
        {currentPath === "react" && (
          <React
            allSections={allSections}
            targetSection={sectionTitle}
            handleSelectSuggestion={handleSelectSuggestion}
          />
        )}
      </div>
    </div>
  );
};

export default Wiki;
