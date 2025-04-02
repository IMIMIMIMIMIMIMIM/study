import { useState, useEffect } from "react";
import { hamburger } from "../assets/assets";
import Html from "./Html";
import ReactComp from "./React";
import Jsts from "./Jsts";
import { useNavigate, useLocation } from "react-router-dom";
import htmlData from "../assets/data/HtmlData.json";
import jsData from "../assets/data/JsData.json";
import reactData from "../assets/data/ReactData.json";

const Wiki = () => {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<
    { title: string; page: string }[]
  >([]);
  const allSections = [
    ...htmlData.map((item) => ({ title: item.title, page: "htmlcss" })),
    ...jsData.map((item) => ({ title: item.title, page: "jsts" })),
    ...reactData.map((item) => ({ title: item.title, page: "react" })),
  ];

  const [sections, setSections] = useState(allSections);

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    // URL에서 section 파라미터를 가져와 해당 섹션으로 스크롤 이동
    const params = new URLSearchParams(location.search);
    const sectionTitle = params.get("section");

    if (sectionTitle) {
      setTimeout(() => {
        const target = Array.from(document.querySelectorAll("h2")).find(
          (h2) => h2.textContent === sectionTitle
        );

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); // 페이지가 완전히 렌더링될 때까지 대기
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
    setSearch("");
    setSuggestions([]);
    setPage(item.page);
    navigate(`/${item.page}?section=${encodeURIComponent(item.title)}`);
  };

  return (
    <div className="min-h-screen flex bg-beige">
      <nav
        className={` ${
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
          onClick={() => setPage("home")}
        >
          Wiki
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setPage("htmlcss")}
              className="block w-full text-left"
            >
              HTML & CSS
            </button>
          </li>
          <li>
            <button
              onClick={() => setPage("jsts")}
              className="block w-full text-left"
            >
              JS & TS
            </button>
          </li>
          <li>
            <button
              onClick={() => setPage("react")}
              className="block w-full text-left"
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
            <div className="relative w-72 sm:w-96">
              <input
                type="text"
                className="px-4 py-2 w-full border rounded-3xl"
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
        {page === "react" && <ReactComp />}
      </div>
    </div>
  );
};

export default Wiki;
