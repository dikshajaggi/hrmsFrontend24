import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

const ExportModuleDropdowns = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group w-full" ref={ref}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-all">
        {label}
      </label>

      {/* Selected Field */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-sm"
      >
        <span>{value || options[0]}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto max-h-52   /* FIXED HEIGHT + SCROLL */ 
                       scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                       
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition ${
                  opt === value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExportModuleDropdowns
