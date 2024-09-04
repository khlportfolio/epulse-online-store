"use client"

import kyInstance from "@/lib/ky"
import { ProductContentsPage, ProductData } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import DeleteProductDialog from "./DeleteProductDialog"
import EditProductDialog from "./EditProductDialog"

interface DataFetchingProps {
    categoryId: string
}

const DataFetching = ({ categoryId }: DataFetchingProps) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = (product: ProductData) => {
        setSelectedProduct(product)
        setIsDeleteDialogOpen(true)
    }

    const handleEdit = (product: ProductData) => {
        setSelectedProduct(product)
        setIsEditDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
        setSelectedProduct(null)
    }

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false)
        setSelectedProduct(null)
    }

    const { data, status } = useInfiniteQuery({
        queryKey: ["product-content", categoryId],
        queryFn: ({ pageParam }) => {
            // Membuat URLSearchParams
            const searchParams = new URLSearchParams();
            searchParams.append('categoryId', categoryId);
            if (pageParam) {
                searchParams.append('cursor', pageParam);
            }

            return kyInstance
                .get(`/api/product`, { searchParams })
                .json<ProductContentsPage>()
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const productContents = data?.pages.flatMap((page) => page.productContents) || []

    if (status === "pending") {
        return <Loader2 size={30} className="animate-spin mx-auto" />
    }

    return (
        <>
            <DataTable columns={columns(handleDelete, handleEdit)} data={productContents} />
            {selectedProduct && (
                <DeleteProductDialog
                    productContent={selectedProduct}
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    categoryId={categoryId}
                />
            )}
            {selectedProduct && (
                <EditProductDialog
                    product={selectedProduct}
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                    categoryId={categoryId}
                />
            )}
        </>
    )
}

export default DataFetching
