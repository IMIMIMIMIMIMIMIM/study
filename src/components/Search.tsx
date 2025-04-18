import { useState, useEffect } from "react";

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

  useEffect(() => {
    const saved = localStorage.getItem("recentSearch");
    if (saved) setRecentSearch(JSON.parse(saved));
  }, []);

  const saveRecentSearch = (title: string) => {
    setRecentSearch((prev) => {
      const updated = [title, ...prev.filter((item) => item !== title)].slice(
        0,
        10
      );
      localStorage.setItem("recentSearch", JSON.stringify(updated));
      return updated;
    });
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
    saveRecentSearch(item.title);
    setSearch("");
    setSuggestions([]);
    setHighlightIndex(-1);
    onSelect(item);
    setSidebarOpen(true);
  };

  return (
    <div className="relative w-72 sm:w-96">
      <input
        type="text"
        className="px-4 py-2 w-full border rounded-3xl"
        value={
          highlightIndex >= 0 ? suggestions[highlightIndex]?.title : search
        }
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setTimeout(() => {
            setHighlightIndex(-1);
          }, 100); // 버튼 클릭 인식 시간 확보
        }}
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
          }
        }}
      />

      {/* 최근 검색어 */}
      {isFocused && search.trim() === "" && recentSearch.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-10">
          {recentSearch.map((title) => {
            const item = allSections.find((s) => s.title === title);
            if (!item) return null;
            return (
              <li
                key={title}
                className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <span onClick={() => handleSelect(item)}>{title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRecentSearch(title);
                  }}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* 자동완성 */}
      {search.trim() !== "" && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-10">
          {suggestions.map((item, index) => (
            <li
              key={item.title}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
