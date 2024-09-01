import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AboutData } from "@/lib/types";
import { useDeleteAboutMutation } from "./mutations"

interface DeleteAboutDialogProps {
    aboutContent: AboutData,
    open: boolean,
    onClose: () => void
}

const DeleteAboutDialog = ({ aboutContent, open, onClose }: DeleteAboutDialogProps) => {
    const mutation = useDeleteAboutMutation();

    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete About Content?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this cocntent? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant="destructive" onClick={() => mutation.mutate(aboutContent.id, { onSuccess: onClose })} loading={mutation.isPending}>
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

export default DeleteAboutDialog