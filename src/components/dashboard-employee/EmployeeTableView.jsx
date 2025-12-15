import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import ExportDataModal from "../common/ExportDataModal";
import SearchExportData from "../SearchExportData";
import { MoreVertical, Pencil, Trash, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { WarningModal } from "../common/WarningModal";
import { Drawer } from "../common/Drawer";


const EmployeeTableView = ({ employees, filters, setFilters}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  

  const data = useMemo(() => employees, [employees]);

  const handleDelete = () => {

  }

  // 🔹 Define columns with icons where appropriate
  const columns = useMemo(
    () => [
    //     {
    //   id: "select",
    //   header: ({ table }) => (
    //     <input
    //       type="checkbox"
    //       className="cursor-pointer"
    //       checked={table.getIsAllPageRowsSelected()}
    //       onChange={table.getToggleAllPageRowsSelectedHandler()}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <input
    //       type="checkbox"
    //       className="cursor-pointer"
    //       checked={row.getIsSelected()}
    //       onChange={row.getToggleSelectedHandler()}
    //     />
    //   ),
    //   size: 50,
    // },

    // ============================
    // 2️⃣ Serial Number Column
    // ============================
    {
      id: "sno",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
      size: 60,
    },

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
           {row.original.image ? <img
              src={row.original.image || "https://via.placeholder.com/40"}
              alt={row.original.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            /> : <User />}
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
        cell: ({ row }) => row.original.department?.department_name || "—",
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
        cell: ({ row }) => row.original.branch?.branch_name || "—",
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
        cell: ({ row }) => row.original.projectSite?.site_name || "—",
        size: 180,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 100,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const employee = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded hover:bg-gray-100">
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => setShowEdit(true)}
                  className="cursor-pointer text-blue-600 focus:text-blue-700"
                >
                  <Pencil size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>

                 <DropdownMenuItem
                  onClick={() => setSelectedEmployee(employee)}
                  className="cursor-pointer text-blue-600 focus:text-blue-700"
                >
                  <Trash size={14} className="mr-2" />
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 80,
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
    enableRowSelection: true,
  });

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <SearchExportData globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} setShowExport={setShowExport} />

      {showExport && (
         <ExportDataModal 
            isOpen={showExport}
            onClose={() => setShowExport(false)}
            modal="employee"
            data={employees} 
            filters={filters} 
            setFilters={setFilters}                  
        />
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
                className="border-b border-gray-100 hover:bg-gray-50 transition capitalize"
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
      <WarningModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        employeeName="Rahul Sharma"
        loading={loading}
      />
      <Drawer
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Employee"
        subtitle="Quick updates"
      >
        {/* <EditEmployeeForm employee={selectedEmployee} /> */}
      </Drawer>

       <Drawer
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={selectedEmployee?.name}
          subtitle={selectedEmployee?.designation?.designation_name}
          headerActions={
            <button className="text-sm text-blue-600 font-medium">
              Full Profile →
            </button>
          }
        >
          {/* Employee summary / tabs */}
        </Drawer>

    </div>
  );
};

export default EmployeeTableView;
