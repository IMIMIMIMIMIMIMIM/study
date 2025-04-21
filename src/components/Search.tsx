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

  useEffect(() => {
    const saved = localStorage.getItem("recentSearch");
    if (saved) setRecentSearch(JSON.parse(saved));
  }, []);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveRecentSearch = (title: string) => {
    const updated = [
      title,
      ...recentSearch.filter((item) => item !== title),
    ].slice(0, 5);

    try {
      localStorage.setItem("recentSearch", JSON.stringify(updated));
      console.log("저장 성공:", updated);
    } catch (e) {
      console.error("로컬스토리지 저장 에러:", e);
    }

    setRecentSearch(updated);
  };

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

  const handleSelect = (item: Section) => {
    console.log("클릭된 최근 검색어:", item);
    saveRecentSearch(item.title);
    setSearch("");
    setSuggestions([]);
    setHighlightIndex(-1);
    onSelect(item);
    setSidebarOpen(true);
  };

  const renderSearchList = (items: (Section & { _index?: number })[]) => (
    <ul className="p-2 pl-0 absolute top-full left-0 w-full bg-white border-t-0 rounded-b-3xl shadow-lg z-10">
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
                  e.stopPropagation(); // 클릭 이벤트 버블링 방지
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

  return (
    <div ref={containerRef} className="relative w-72 sm:w-96">
      <input
        type="text"
        placeholder="Wiki 검색"
        className={`px-4 py-2 w-full focus:outline-none ${
          isFocused ? "rounded-3xl rounded-b-none" : "rounded-3xl"
        }`}
        value={
          highlightIndex >= 0 ? suggestions[highlightIndex]?.title : search
        }
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
              Math.min(prev + 1, suggestions.length - 1)
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
          } else if (e.key === "Enter") {
            if (highlightIndex >= 0 && suggestions[highlightIndex]) {
              handleSelect(suggestions[highlightIndex]);
              setHighlightIndex(-1);
            }
          } else if (e.key === "Escape") {
            setIsFocused(false);
            setHighlightIndex(-1);
          }
        }}
      />

      {search.trim() !== "" &&
        suggestions.length > 0 &&
        renderSearchList(suggestions)}

      {isFocused &&
        search.trim() === "" &&
        recentSearch.length > 0 &&
        renderSearchList(
          recentSearch
            .map((title) => allSections.find((s) => s.title === title))
            .filter((item): item is Section => !!item)
            .map((item, index) => ({ ...item, _index: index }))
        )}
    </div>
  );
};

export default Search;
