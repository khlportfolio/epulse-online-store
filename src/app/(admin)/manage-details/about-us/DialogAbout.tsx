"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import InputEditor from '@/components/InputEditor';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DialogAbout = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-primary text-white hover:bg-primary-dark'>Add About Content</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>About Us</DialogTitle>
                    <DialogDescription>
                        You can adding your about profile here.
                    </DialogDescription>
                </DialogHeader>
                <InputEditor onSubmitSuccess={handleCloseDialog} />
            </DialogContent>
        </Dialog>
    )
}

export default DialogAbout