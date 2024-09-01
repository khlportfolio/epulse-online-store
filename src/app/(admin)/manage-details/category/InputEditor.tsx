"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./styles.css";
import LoadingButton from "@/components/LoadingButton";
import { useSubmitCategoryMutation } from "./mutations";

interface InputEditorProps {
    onSubmitSuccess: () => void;
}

const InputEditor = ({ onSubmitSuccess }: InputEditorProps) => {
    const mutation = useSubmitCategoryMutation();

    // Editor for title
    const nameEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter category...",
            }),
        ],
    });

    // Get content from editors
    const name = nameEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    async function onSubmit() {
        mutation.mutate({ name }, {
            onSuccess: () => {
                nameEditor?.commands.clearContent();
                onSubmitSuccess();
            }
        })
    }

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div>
                <h2 className="text-base mb-2">Name</h2>
                <EditorContent
                    editor={nameEditor}
                    className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
                />
            </div>
            <div className="flex justify-end">
                <LoadingButton onClick={onSubmit} loading={mutation.isPending} disabled={!name.trim()} className="min-w-20">Submit</LoadingButton>
            </div>
        </div>
    );
};

export default InputEditor;
