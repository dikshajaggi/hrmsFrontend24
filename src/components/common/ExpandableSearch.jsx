import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ExpandableSearch = () => {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Collapse when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        inputRef.current?.blur();
        setExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div
        className={`search-container relative flex items-center transition-all duration-300 ${
          expanded ? "w-64 md:w-72" : "w-9"
        }`}
      >
        {/* Search Icon */}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer z-10"
        >
          <Search size={20} />
        </button>

        {/* Search Input */}
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className={`pr-10 transition-all duration-300 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200
            focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none
            ${expanded ? "opacity-100 w-full pl-3 shadow-sm" : "opacity-0 w-0 pl-0"}`}
          onFocus={() => setExpanded(true)}
        />
      </div>
    </div>
  );
};

export default ExpandableSearch;
