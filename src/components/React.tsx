import { useState, useRef, useEffect, useMemo } from "react";
import sectionData from "../assets/data/ReactData.json";
import { useLocation } from "react-router-dom";

const React = ({ targetSection }: { targetSection: string | null }) => {
  const location = useLocation();
  const sections = useMemo(
    () =>
      sectionData.map((section, index) => ({
        key: `section${index}`,
        title: section.title,
        content: section.content,
      })),
    []
  );

  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setOpenSections({});
  }, [location.pathname]);

  // targetSection으로 해당 섹션 열고 스크롤
  useEffect(() => {
    if (targetSection) {
      const matched = sections.find(
        (section) => section.title === targetSection
      );

      if (matched) {
        const { key } = matched;

        // 기존 열림 상태 초기화하고 해당 섹션만 열기
        setOpenSections({ [key]: true });

        // 스크롤 이동
        setTimeout(() => {
          sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [targetSection, sections]);

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // 자동완성 필터링
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAutoCompleteClick = (key: string) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth" });

    setOpenSections((prevState) => ({
      ...prevState,
      [key]: true,
    }));
    setSearch("");
  };

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
                onClick={() => handleAutoCompleteClick(section.key)}
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

export default React;
