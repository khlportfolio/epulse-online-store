"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { CategoryData, SizeData } from "@/lib/types"

export const columns = (
    handleDelete: (size: SizeData) => void,
    handleEdit: (size: SizeData) => void
): ColumnDef<SizeData>[] => [
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
