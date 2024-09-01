"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { CategoryData } from "@/lib/types"

export const columns = (
    handleDelete: (category: CategoryData) => void,
    handleEdit: (category: CategoryData) => void
): ColumnDef<CategoryData>[] => [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ]
