import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryData } from "@/lib/types";
import { useDeleteCategoryMutation } from "./mutations"

interface DeleteCategoryDialogProps {
    categoryContent: CategoryData,
    open: boolean,
    onClose: () => void
}

const DeleteCategoryDialog = ({ categoryContent, open, onClose }: DeleteCategoryDialogProps) => {
    const mutation = useDeleteCategoryMutation();

    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Category?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this category? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant="destructive" onClick={() => mutation.mutate(categoryContent.id, { onSuccess: onClose })} loading={mutation.isPending}>
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

export default DeleteCategoryDialog