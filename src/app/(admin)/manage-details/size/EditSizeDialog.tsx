"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { SizeData } from "@/lib/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { useUpdateSizeMutation } from "./mutations"

interface EditSizeDialogProps {
    sizeContent: SizeData
    open: boolean
    onClose: () => void
}

const EditSizeDialog = ({ sizeContent, open, onClose }: EditSizeDialogProps) => {
    const mutation = useUpdateSizeMutation()

    // Editor for title
    const nameEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter name...",
            }),
        ],
        content: sizeContent.name,
    })

    // Get content from editors
    const name = nameEditor?.getText({
        blockSeparator: "\n",
    }) || ""

    async function onSubmit() {
        mutation.mutate({ id: sizeContent.id, name }, {
            onSuccess: () => {
                nameEditor?.commands.clearContent()
                onClose()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Size</DialogTitle>
                </DialogHeader>
                <div>
                    <h2 className="text-base mb-2">Name</h2>
                    <EditorContent
                        editor={nameEditor}
                        className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
                    />
                </div>
                <DialogFooter>
                    <LoadingButton onClick={onSubmit} loading={mutation.isLoading} disabled={!name.trim()} className="min-w-20">
                        Save Changes
                    </LoadingButton>
                    <Button variant="outline" onClick={onClose} disabled={mutation.isLoading}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditSizeDialog
