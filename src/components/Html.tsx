import { useState, useRef, useEffect, useMemo } from "react";
import sectionData from "../assets/data/HtmlData.json";
import Search from "./Search";

type HtmlProps = {
  targetSection: string | null;
  handleSelectSuggestion: (item: { title: string; page: string }) => void;
  allSections: { title: string; page: string }[];
};

const Html = ({
  targetSection,
  handleSelectSuggestion,
  allSections,
}: HtmlProps) => {
  const sections = useMemo(
    () =>
      sectionData.map((section, index) => ({
        key: `section${index}`,
        title: section.title,
        content: section.content,
        page: "html",
      })),
    []
  );

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // const hasScrolled = useRef(false); // 중복 스크롤 방지

  useEffect(() => {
    if (targetSection) {
      const matched = sections.find(
        (section) => section.title === targetSection
      );

      if (matched) {
        const { key } = matched;

        setOpenSections({
          [key]: true,
        });

        setTimeout(() => {
          sectionRefs.current[key]?.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }, 100); // 부드럽게 하기 위해 약간 딜레이 줘도 됨
      }
    }
  }, [targetSection, sections]);

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="space-y-6 md:mx-64">
      {/* 검색창 */}
      <Search
        allSections={allSections}
        onSelect={handleSelectSuggestion}
        setSidebarOpen={() => {}}
      />

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
                ? "max-h-full opacity-100 mt-2"
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
