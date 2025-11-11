import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import ExportDataModal from "./common/ExportDataModal";
import { Search, User, Building2, MapPin, Briefcase, Users } from "lucide-react";
import SearchExportData from "./SearchExportData";

const EmployeeTableView = ({ employees }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showExport, setShowExport] = useState(false);

  const data = useMemo(() => employees, [employees]);

  // 🔹 Define columns with icons where appropriate
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => (
          <div className="flex items-center gap-1">
            {/* <Users size={14} className="text-gray-400" />  */}
            ID
          </div>
        ),
        size: 60,
      },
      {
        accessorKey: "name",
        header: () => (
          <div className="flex items-center gap-1">
            {/* <User size={14} className="text-gray-400" />  */}
            Name
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.image || "https://via.placeholder.com/40"}
              alt={row.original.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="font-medium text-gray-800">{row.original.name}</span>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "department",
        header: () => (
          <div className="flex items-center gap-1">
            {/* <Briefcase size={14} className="text-gray-400" />  */}
            Department
          </div>
        ),
        size: 160,
      },
      {
        accessorKey: "branch",
        header: () => (
          <div className="flex items-center gap-1">
            {/* <Building2 size={14} className="text-gray-400" />  */}
            Branch
          </div>
        ),
        size: 140,
      },
      {
        accessorKey: "projectSite",
        header: () => (
          <div className="flex items-center gap-1">
            {/* <MapPin size={14} className="text-gray-400" />  */}
            Project Site
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 100,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter},
    columnResizeMode: "onChange",
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <SearchExportData globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} setShowExport={setShowExport} />

      {showExport && (
        <ExportDataModal isOpen={showExport} onClose={() => setShowExport(false)} />
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="relative px-4 py-3 text-left whitespace-nowrap select-none border-r border-gray-200"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}

                    {/* Resize Line */}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-[2px] cursor-col-resize transition-colors ${
                        header.column.getIsResizing()
                          ? "bg-blue-500 opacity-80"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-sm text-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 whitespace-nowrap border-r border-gray-100"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between">
        <button
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTableView;
