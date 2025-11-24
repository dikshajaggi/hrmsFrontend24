import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const actionsColumn = (onEdit, onDelete) => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const item = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded hover:bg-gray-100">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => onEdit(item)}
            className="cursor-pointer"
          >
            <Pencil size={14} className="mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onDelete(item)}
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
});
