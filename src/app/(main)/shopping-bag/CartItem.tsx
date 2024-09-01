"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { deleteCartItem } from "./actions";

interface CartItemProps {
    item: {
        id: string;
        quantity: number;
        product: {
            id: string;
            title: string;
            price: number;
            imageUrl: string;
        };
        size?: {
            id: string;
            name: string;
        };
    };
    onDelete: (itemId: string) => void;
}

const CartItem = ({ item, onDelete }: CartItemProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await deleteCartItem(item.id);
        onDelete(item.id);
        setIsDeleting(false);
    };

    return (
        <div className={`flex items-center justify-between p-4 border rounded-lg ${isDeleting ? "opacity-50" : ""}`}>
            <div className="flex items-center space-x-4">
                <Image
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    width={80}
                    height={80}
                    className="rounded-lg"
                />
                <div>
                    <h2 className="text-lg font-semibold">{item.product.title}</h2>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-gray-600">Price: {formatCurrency(item.product.price)}</p>
                    {item.size && (
                        <p className="text-gray-600">Size: {item.size.name}</p>
                    )}
                </div>
            </div>
            <ConfirmDeleteDialog
                cartItemId={item.id}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default CartItem;
