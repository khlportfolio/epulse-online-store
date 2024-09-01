import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryData } from "@/lib/types";
import { useDeleteSizeMutation } from "./mutations"

interface DeleteSizeDialogProps {
    sizeContent: CategoryData,
    open: boolean,
    onClose: () => void
}

const DeleteSizeDialog = ({ sizeContent, open, onClose }: DeleteSizeDialogProps) => {
    const mutation = useDeleteSizeMutation();

    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Size?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this size? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant="destructive" onClick={() => mutation.mutate(sizeContent.id, { onSuccess: onClose })} loading={mutation.isPending}>
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

export default DeleteSizeDialog