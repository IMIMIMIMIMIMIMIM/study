import { useState, useRef, useEffect } from "react";
import sectionData from "../assets/data/HtmlData.json";

const Html = () => {
  const generateSections = (data: { title: string; content: string }[]) => {
    return data.map((section, index) => ({
      key: `section${index}`, // 섹션을 고유하게 구분할 수 있는 key
      title: section.title,
      content: section.content,
    }));
  };

  const sections = generateSections(sectionData); // 동적으로 섹션 생성

  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // 검색어에 따라 자동완성 필터링
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAutoCompleteClick = (key: string) => {
    // 섹션으로 스크롤 이동
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
    });
    // 해당 섹션 열기
    setOpenSections((prevState) => ({
      ...prevState,
      [key]: true,
    }));
    setSearch("");
  };

  useEffect(() => {
    const savedSection = localStorage.getItem("selectedSection");

    if (savedSection) {
      setTimeout(() => {
        setOpenSections((prev) => ({
          ...prev,
          [savedSection]: true,
        }));
        sectionRefs.current[savedSection]?.scrollIntoView({
          behavior: "smooth",
        });

        localStorage.removeItem("selectedSection"); // ✅ 사용 후 제거
      }, 500);
    }
  }, []);

  return (
    <div className="space-y-6 ml-64 mr-64">
      {/* 검색창 */}
      <div className="relative flex justify-center items-center">
        <input
          type="text"
          className="px-4 py-2 sm:w-96 border rounded-3xl border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* 자동완성 */}
        {search && filteredSections.length > 0 && (
          <ul className="absolute top-full w-96 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {filteredSections.map((section) => (
              <li
                key={section.key}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleAutoCompleteClick(section.key)} // 클릭 시 자동완성 목록 닫기
              >
                {section.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 섹션 */}
      {sections.map((section) => (
        <div
          key={section.key}
          ref={(el) => (sectionRefs.current[section.key] = el)}
        >
          <button
            onClick={() => toggleSection(section.key)}
            className="w-full px-4 py-2 text-lg text-gray-900 bg-gray-200 rounded-md flex justify-between items-center"
          >
            {section.title}
            <span>{openSections[section.key] ? "▲" : "▼"}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openSections[section.key]
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 bg-blue-100 rounded-md text-gray-800">
              <p>
                {section.content.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Html;
