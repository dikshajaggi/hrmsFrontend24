import { Import, Search } from 'lucide-react'
import React from 'react'

const SearchExportData = ({globalFilter, setGlobalFilter, setShowExport}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100 bg-gray-50">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full border border-gray-200 bg-gray-50 hover:bg-white rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-0 focus:border-gray-300"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
           <Import size={16} /> Export Employee Data
        </button>
      </div>
  )
}

export default SearchExportData
