import { useState, useEffect, useRef } from "react";

type Section = {
  title: string;
  page: string;
};

type Props = {
  allSections: Section[];
  onSelect: (item: Section) => void;
  setSidebarOpen: (open: boolean) => void;
};

const Search = ({ allSections, onSelect, setSidebarOpen }: Props) => {
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Section[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 페이지 이동 시 검색어 남기기
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const section = urlSearchParams.get("section");
    if (section) {
      setSearch(decodeURIComponent(section));
    }
  }, [location]);

  // 최근 검색어 로컬 저장
  useEffect(() => {
    const saved = localStorage.getItem("recentSearch");
    if (saved) setRecentSearch(JSON.parse(saved));
  }, []);

  // 목록 외부 클릭시
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setHighlightIndex(-1);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 최근 검색어
  const saveRecentSearch = (title: string) => {
    const updated = [
      title,
      ...recentSearch.filter((item) => item !== title),
    ].slice(0, 5);
    try {
      localStorage.setItem("recentSearch", JSON.stringify(updated));
    } catch (e) {
      console.error("로컬스토리지 저장 에러:", e);
    }
    setRecentSearch(updated);
  };

  // 최근 검색어 삭제
  const handleDeleteRecentSearch = (title: string) => {
    setRecentSearch((prev) => {
      const updated = prev.filter((item) => item !== title);
      localStorage.setItem("recentSearch", JSON.stringify(updated));
      return updated;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setHighlightIndex(-1);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      setSuggestions(
        allSections.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };
  const isMobile = window.innerWidth < 768;

  const handleSelect = (item: Section) => {
    console.log("제목: ", item.title);

    saveRecentSearch(item.title);
    setSearch(item.title);
    setSuggestions([]);
    setHighlightIndex(-1);
    onSelect(item);
    setSidebarOpen(true);
    setIsFocused(false);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderSearchList = (items: (Section & { _index?: number })[]) => (
    <ul className="p-2 pl-0 absolute top-full left-0 w-full bg-white border-t-0 rounded-b-3xl shadow-lg overflow-hidden">
      {items.map((item, i) => {
        const isRecent = typeof item._index === "number";
        return (
          <li
            key={item.title}
            className={`group flex justify-between items-center px-4 py-2 cursor-pointer ${
              i === highlightIndex
                ? "bg-gray-200  rounded-r-xl"
                : "hover:bg-gray-50"
            }`}
            onMouseEnter={() => setHighlightIndex(i)}
          >
            <span onClick={() => handleSelect(item)}>{item.title}</span>

            {isRecent && (
              <button
                className="text-gray-400 hover:text-red-500 ml-2 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecentSearch(item.title);
                }}
              >
                ✕
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );

  // 현재 표시 중인 리스트 결정
  const displayedList =
    search.trim() === ""
      ? recentSearch
          .map((title) => allSections.find((s) => s.title === title))
          .filter((item): item is Section => !!item)
          .map((item, index) => ({ ...item, _index: index }))
      : suggestions;

  return (
    <div ref={containerRef} className="relative w-72 sm:w-96">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Wiki 검색"
          className={`px-4 py-2 w-full focus:outline-none ${
            isFocused && displayedList.length > 0
              ? "rounded-3xl rounded-b-none"
              : "rounded-3xl"
          }`}
          value={search}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightIndex((prev) =>
                Math.min(prev + 1, displayedList.length - 1)
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
              if (highlightIndex >= 0 && displayedList[highlightIndex]) {
                handleSelect(displayedList[highlightIndex]);
                setHighlightIndex(-1);
              }
            } else if (e.key === "Escape") {
              setIsFocused(false);
              setHighlightIndex(-1);
            }
          }}
        />
        {search && (
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearch("");
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>
      {isFocused &&
        displayedList.length > 0 &&
        renderSearchList(displayedList.slice(0, 5))}
    </div>
  );
};

export default Search;
