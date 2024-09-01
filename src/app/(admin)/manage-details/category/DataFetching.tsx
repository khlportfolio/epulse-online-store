"use client"

import kyInstance from "@/lib/ky"
import { CategoryContentsPage, CategoryData } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import DeleteCategoryDialog from "./DeleteCategoryDialog"
import EditCategoryDialog from "./EditCategoryDialog"

const DataFetching = () => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = (category: CategoryData) => {
        setSelectedCategory(category)
        setIsDeleteDialogOpen(true)
    }

    const handleEdit = (category: CategoryData) => {
        setSelectedCategory(category)
        setIsEditDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
        setSelectedCategory(null)
    }

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false)
        setSelectedCategory(null)
    }

    const { data, status } = useInfiniteQuery({
        queryKey: ["category-content", "for-admin"],
        queryFn: ({ pageParam }) =>
            kyInstance
                .get("/api/category", pageParam ? { searchParams: { cursor: pageParam } } : {})
                .json<CategoryContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const categoryContents = data?.pages.flatMap((page) => page.categoryContens) || []

    if (status === "pending") {
        return <Loader2 size={30} className="animate-spin mx-auto" />
    }

    return (
        <>
            <DataTable columns={columns(handleDelete, handleEdit)} data={categoryContents} />
            {selectedCategory && (
                <DeleteCategoryDialog
                    categoryContent={selectedCategory}
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                />
            )}
            {selectedCategory && (
                <EditCategoryDialog
                    categoryContent={selectedCategory}
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                />
            )}
        </>
    )
}

export default DataFetching
