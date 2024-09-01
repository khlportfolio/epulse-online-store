"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./styles.css";
import LoadingButton from "./LoadingButton";
import { useSubmitAboutMutation } from "@/app/(admin)/manage-details/about-us/mutations";

interface InputEditorProps {
    onSubmitSuccess: () => void;
}

const InputEditor = ({ onSubmitSuccess }: InputEditorProps) => {
    const mutation = useSubmitAboutMutation();

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
    });

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
    });

    // Get content from editors
    const title = titleEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const description = descriptionEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    async function onSubmit() {
        mutation.mutate({ title, description }, {
            onSuccess: () => {
                titleEditor?.commands.clearContent();
                descriptionEditor?.commands.clearContent();
                onSubmitSuccess();
            }
        })
    }

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
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
            <div className="flex justify-end">
                <LoadingButton onClick={onSubmit} loading={mutation.isPending} disabled={!title.trim()} className="min-w-20">Submit</LoadingButton>
            </div>
        </div>
    );
};

export default InputEditor;
