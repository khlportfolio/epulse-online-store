"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import InputEditor from "./InputEditor";

const DialogCategory = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-primary text-white hover:bg-primary-dark'>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-full">
                <DialogHeader>
                    <DialogTitle>Category</DialogTitle>
                    <DialogDescription>
                        You can add your category here.
                    </DialogDescription>
                </DialogHeader>
                <InputEditor onSubmitSuccess={handleCloseDialog} />
            </DialogContent>
        </Dialog>
    )
}

export default DialogCategory
