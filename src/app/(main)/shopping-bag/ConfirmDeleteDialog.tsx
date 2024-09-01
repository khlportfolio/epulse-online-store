"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';// Pastikan Anda memiliki komponen Spinner atau indikator loading yang sesuai

interface ConfirmDeleteDialogProps {
    cartItemId: string;
    onConfirm: () => Promise<void>;
}

const ConfirmDeleteDialog = ({ cartItemId, onConfirm }: ConfirmDeleteDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Failed to delete item", error);
        } finally {
            setIsDeleting(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                </DialogHeader>
                <p>Apakah Anda yakin ingin menghapus item ini dari keranjang?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 size={15} className="animate-spin" /> : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
