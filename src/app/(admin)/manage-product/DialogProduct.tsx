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

interface DialogData {
    categoryId: string
}

const DialogProduct = ({ categoryId }: DialogData) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-primary text-white hover:bg-primary-dark'>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto text-rendering-auto antialiased">
                <DialogHeader>
                    <DialogTitle>Product</DialogTitle>
                    <DialogDescription>
                        You can adding your product here.
                    </DialogDescription>
                </DialogHeader>
                <InputEditor onSubmitSuccess={handleCloseDialog} categoryId={categoryId} />
            </DialogContent>
        </Dialog>
    )
}

export default DialogProduct