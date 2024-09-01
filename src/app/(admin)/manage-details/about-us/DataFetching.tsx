"use client"

import kyInstance from "@/lib/ky"
import { AboutContentsPage, AboutData } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import DeleteAboutDialog from "./DeleteAboutDialog"
import EditAboutDialog from "./EditAboutDialog"

const DataFetching = () => {
    const [selectedAbout, setSelectedAbout] = useState<AboutData | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = (about: AboutData) => {
        setSelectedAbout(about)
        setIsDeleteDialogOpen(true)
    }

    const handleEdit = (about: AboutData) => {
        setSelectedAbout(about)
        setIsEditDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
        setSelectedAbout(null)
    }

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false)
        setSelectedAbout(null)
    }

    const { data, status } = useInfiniteQuery({
        queryKey: ["about-content", "for-admin"],
        queryFn: ({ pageParam }) =>
            kyInstance
                .get("/api/about-us", pageParam ? { searchParams: { cursor: pageParam } } : {})
                .json<AboutContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const aboutContents = data?.pages.flatMap((page) => page.aboutContents) || []

    if (status === "pending") {
        return <Loader2 size={30} className="animate-spin mx-auto" />
    }

    return (
        <>
            <DataTable columns={columns(handleDelete, handleEdit)} data={aboutContents} />
            {selectedAbout && (
                <DeleteAboutDialog
                    aboutContent={selectedAbout}
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                />
            )}
            {selectedAbout && (
                <EditAboutDialog
                    aboutContent={selectedAbout}
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                />
            )}
        </>
    )
}

export default DataFetching
