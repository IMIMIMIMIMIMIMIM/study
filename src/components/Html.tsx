import { useState, useRef } from "react";

const Html = () => {
  const sectionData = [
    {
      title: "px, em, rem 의 차이",
      content: "px: 고정된 크기, em: 부모 요소 기준, rem: 루트 요소 기준",
    },
    {
      title: "CSS 선택자의 우선순위",
      content:
        "ID 선택자의 우선순위가 가장 높으며 그 다음으로 클래스, 태그 선택자 순서로 적용. 만약 우선순위가 같은 선택자가 있다면 나중에 선언된 것이 우선 적용.",
    },
    {
      title: "Flexbox란",
      content:
        "Flexbox는 요소를 유연하게 배치하고 정렬할 수 있는 도구. 부모 컨테이너에 display: flex를 설정하고, 자식 요소들에 대해 정렬과 배치를 세밀하게 제어할 수 있음",
    },
    {
      title: "margin과 padding의 차이",
      content: "margin: 요소 외부 여백, padding: 요소 내부 여백",
    },
  ];

  // 동적으로 섹션 키를 생성하는 함수
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

  // 검색어에 따라 자동완성 목록 필터링
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
    // 자동완성 목록 닫기
    setSearch(""); // 검색어는 그대로 남기기
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
        {/* 자동완성 목록 */}
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

      {/* 각 섹션들 */}
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
              <p>{section.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Html;
