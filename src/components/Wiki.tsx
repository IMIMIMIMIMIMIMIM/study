import { useState, useEffect } from "react";
import { hamburger } from "../assets/assets";
import Html from "./Html";
import ReactComp from "./React";
import Jsts from "./Jsts";
import { useNavigate, useLocation } from "react-router-dom";
import htmlData from "../assets/data/HtmlData.json";
import jsData from "../assets/data/JsData.json";
import reactData from "../assets/data/ReactData.json";
import Search from "./Search";

const Wiki = () => {
  const [page, setPage] = useState("home");
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

  // 페이지 전환시 섹션 목록 업데이트
  useEffect(() => {
    if (page !== "home") {
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

  // 섹션 파라미터가 있을 때 해당 섹션으로 스크롤
  useEffect(() => {
    const sectionTitle = params.get("section");
    if (sectionTitle) {
      setTimeout(() => {
        const target = Array.from(document.querySelectorAll("h2")).find(
          (h2) => h2.textContent === sectionTitle
        );
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [page]);

  const handleSelectSuggestion = (item: { title: string; page: string }) => {
    setPage(item.page);
    navigate(`/${item.page}?section=${encodeURIComponent(item.title)}`);
  };

  const goToPage = (name: string) => {
    setPage(name);
    navigate(`/${name}`);
  };

  const selectMenu = (name: string) =>
    `block w-full text-left ${page === name ? "font-bold" : ""}`;

  return (
    <div className="min-h-screen flex bg-beige">
      <nav
        className={`${
          sidebarOpen ? "w-64 p-4 opacity-100" : "w-0 p-0 opacity-0"
        } 
          bg-yellow-50 shadow-md fixed h-full transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 z-50 p-2"
          >
            <img src={hamburger} alt="hamburger" className="w-6" />
          </button>
        )}
        <h2
          className="text-2xl font-bold inline-block text-gray-800 mb-6 cursor-pointer"
          onClick={() => {
            setPage("home");
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

      <div className="flex-1 p-6">
        {page === "home" && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Wiki</h1>
            <Search
              allSections={allSections}
              onSelect={handleSelectSuggestion}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        )}
        {page === "htmlcss" && <Html targetSection={sectionTitle} />}
        {page === "jsts" && <Jsts targetSection={sectionTitle} />}
        {page === "react" && <ReactComp targetSection={sectionTitle} />}
      </div>
    </div>
  );
};

export default Wiki;
