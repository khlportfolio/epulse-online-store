"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { AboutData } from "@/lib/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { useUpdateAboutMutation } from "./mutations"

interface EditAboutDialogProps {
    aboutContent: AboutData
    open: boolean
    onClose: () => void
}

const EditAboutDialog = ({ aboutContent, open, onClose }: EditAboutDialogProps) => {
    const mutation = useUpdateAboutMutation()

    // Editor for title
    const titleEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter title...",
            }),
        ],
        content: aboutContent.title,
    })

    // Editor for description
    const descriptionEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter description...",
            }),
        ],
        content: aboutContent.description,
    })

    // Get content from editors
    const title = titleEditor?.getText({
        blockSeparator: "\n",
    }) || ""

    const description = descriptionEditor?.getText({
        blockSeparator: "\n",
    }) || ""

    async function onSubmit() {
        mutation.mutate({ id: aboutContent.id, title, description }, {
            onSuccess: () => {
                titleEditor?.commands.clearContent()
                descriptionEditor?.commands.clearContent()
                onClose()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit About Content</DialogTitle>
                </DialogHeader>
                <div>
                    <h2 className="text-base mb-2">Title</h2>
                    <EditorContent
                        editor={titleEditor}
                        className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
                    />
                </div>
                <div>
                    <h2 className="text-base mb-2">Description</h2>
                    <EditorContent
                        editor={descriptionEditor}
                        className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
                    />
                </div>
                <DialogFooter>
                    <LoadingButton onClick={onSubmit} loading={mutation.isLoading} disabled={!title.trim()} className="min-w-20">
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

export default EditAboutDialog
