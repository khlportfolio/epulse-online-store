"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { AboutData } from "@/lib/types"

export const columns = (
    handleDelete: (about: AboutData) => void,
    handleEdit: (about: AboutData) => void
): ColumnDef<AboutData>[] => [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "description",
            header: "Description",
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
