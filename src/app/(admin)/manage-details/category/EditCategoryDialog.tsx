"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { CategoryData } from "@/lib/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { useUpdateCategoryMutation } from "./mutations"

interface EditCategoryDialogProps {
    categoryContent: CategoryData
    open: boolean
    onClose: () => void
}

const EditCategoryDialog = ({ categoryContent, open, onClose }: EditCategoryDialogProps) => {
    const mutation = useUpdateCategoryMutation()

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
        content: categoryContent.name,
    })

    // Get content from editors
    const name = nameEditor?.getText({
        blockSeparator: "\n",
    }) || ""

    async function onSubmit() {
        mutation.mutate({ id: categoryContent.id, name }, {
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
                    <DialogTitle>Edit Category</DialogTitle>
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

export default EditCategoryDialog
