import React, { useState } from "react";
import useData from "../Hooks/useData";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading, error } = useData(
    `/articlesearch.json?q=${query}&fq=${filter}`
  );
  if (isLoading) {
    ("This is loading");
  }

  if (error) {
    ("An unknown error has occurred");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value ? e.target.value : "");
  };

  return <input type="text" placeholder="Search Article" />;
};

export default SearchBar;
