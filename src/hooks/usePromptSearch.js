import { useState } from "react";

export default function usePromptSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching prompts for:", query);
    // Mock search filter logic
    setResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    results,
    handleSearch,
  };
}
