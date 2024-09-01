"use client"

import kyInstance from "@/lib/ky"
import { SizeContentsPage, SizeData } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import DeleteSizeDialog from "./DeleteSizeDialog"
import EditSizeDialog from "./EditSizeDialog"

const DataFetching = () => {
    const [selectedSize, setSelectedSize] = useState<SizeData | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = (size: SizeData) => {
        setSelectedSize(size)
        setIsDeleteDialogOpen(true)
    }

    const handleEdit = (size: SizeData) => {
        setSelectedSize(size)
        setIsEditDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
        setSelectedSize(null)
    }

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false)
        setSelectedSize(null)
    }

    const { data, status } = useInfiniteQuery({
        queryKey: ["size-content", "for-admin"],
        queryFn: ({ pageParam }) =>
            kyInstance
                .get("/api/size", pageParam ? { searchParams: { cursor: pageParam } } : {})
                .json<SizeContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const sizeContents = data?.pages.flatMap((page) => page.sizeContents) || []

    if (status === "pending") {
        return <Loader2 size={30} className="animate-spin mx-auto" />
    }

    return (
        <>
            <DataTable columns={columns(handleDelete, handleEdit)} data={sizeContents} />
            {selectedSize && (
                <DeleteSizeDialog
                    sizeContent={selectedSize}
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                />
            )}
            {selectedSize && (
                <EditSizeDialog
                    sizeContent={selectedSize}
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                />
            )}
        </>
    )
}

export default DataFetching
