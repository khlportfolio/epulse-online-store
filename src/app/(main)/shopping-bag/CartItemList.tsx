"use client";

import { useState } from "react";
import CartItem from "./CartItem";
import { formatCurrency, formatWhatsAppMessage } from "@/utils/formatMessage";
import { checkoutAndUpdateStock } from "./actions";
import { useToast } from "@/components/ui/use-toast";

interface CartItemData {
    id: string;
    quantity: number;
    product: {
        id: string;
        title: string;
        price: number;
        imageUrl: string;
    };
}

interface CartItemsListProps {
    cartItems: CartItemData[];
    totalPrice: number;
    username?: string; // Tambahkan username ke dalam props
}

const CartItemsList = ({ cartItems: initialCartItems, totalPrice: initialTotalPrice, username }: CartItemsListProps) => {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);

    const { toast } = useToast();

    const handleItemDelete = (itemId: string) => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);

        // Recalculate total price after item deletion
        const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
        setTotalPrice(updatedTotalPrice);
    };

    const handleCheckout = async () => {
        try {
            // Lakukan checkout dan update stok di server
            await checkoutAndUpdateStock(cartItems);
            toast({
                variant: 'default',
                description: "Checkout Success"
            })

            // Setelah berhasil, format pesan dan buka WhatsApp
            const message = formatWhatsAppMessage(username!, cartItems, totalPrice);
            const phoneNumber = "6283838732975";
            const url = `https://wa.me/${phoneNumber}?text=${message}`;

            window.open(url, "_blank");
        } catch (error) {
            toast({
                variant: 'destructive',
                description: "Checkout Gagal, Pastikan stok mencukupi"
            })
            console.error("Checkout Error:", error);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} onDelete={handleItemDelete} />
                ))}
            </div>
            <div className="flex justify-end mt-8">
                <div className="bg-white p-4 rounded-md shadow-md w-full md:w-1/2">
                    <h2 className="text-xl font-semibold text-primary">Order Summary</h2>
                    <div className="flex justify-between mt-4">
                        <span className="text-lg">Total</span>
                        <span className="text-lg font-bold">{formatCurrency(totalPrice)}</span>
                    </div>
                    <button
                        className="mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItemsList;
