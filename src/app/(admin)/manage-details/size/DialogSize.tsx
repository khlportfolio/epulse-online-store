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

const DialogSize = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-primary text-white hover:bg-primary-dark'>Add Size</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Size</DialogTitle>
                    <DialogDescription>
                        You can adding your size here.
                    </DialogDescription>
                </DialogHeader>
                <InputEditor onSubmitSuccess={handleCloseDialog} />
            </DialogContent>
        </Dialog>
    )
}

export default DialogSize