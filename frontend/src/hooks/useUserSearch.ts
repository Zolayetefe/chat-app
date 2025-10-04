import { useState, useCallback } from "react";
import { apiFetch } from "../api/api";
import type { SearchUser } from "../types/chat";

// Simple debounce utility (for production, consider a library like lodash)
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export function useUserSearch(currentUserId: string) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.trim().length > 0) {
        try {
          const results = await apiFetch<SearchUser[]>(`/users/search?q=${encodeURIComponent(query)}`, {
            method: "GET",
          });
          // Filter out the current user
          setSearchResults(results.filter((user) => user._id !== currentUserId));
        } catch (error) {
          console.error("Search failed", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    },
    [currentUserId]
  );

  // Debounced search (300ms delay)
  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return { searchTerm, setSearchTerm, searchResults, handleInputChange };
}