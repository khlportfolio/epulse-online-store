import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductData } from "@/lib/types";
import { useDeleteProductMutation } from "./mutations"

interface DeleteProductDialogProps {
    productContent: ProductData,
    open: boolean,
    onClose: () => void,
    categoryId: string
}

const DeleteProductDialog = ({ productContent, open, onClose, categoryId }: DeleteProductDialogProps) => {
    const mutation = useDeleteProductMutation(categoryId);

    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Product?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant="destructive" onClick={() => mutation.mutate(productContent.id, { onSuccess: onClose })} loading={mutation.isPending}>
                        Delete
                    </LoadingButton>
                    <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteProductDialog