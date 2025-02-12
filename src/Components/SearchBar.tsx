import React from "react";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  handleSearch,
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-gray-300 pb-2">
      <input
        type="text"
        placeholder="Search Articles"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.trim() === "") {
            handleSearch();
          }
        }}
        className="w-full text-lg px-3 py-2 border-none focus:outline-none font-serif"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        onClick={handleSearch}
        className="px-5 py-2 text-lg font-semibold font-serif bg-black text-white tracking-wide uppercase transition hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
