"use client";

import { useEffect, useState } from "react";
import AddToBagButton from "@/components/AddToBagButton";
import BookmarkButton from "@/components/BookmarkButton";
import SizeButton from "@/components/SizeButton";
import { addToBagAction } from "./actions";
import { useToast } from "@/components/ui/use-toast";

interface SizeWithStock {
    id: string;
    name: string;
    stock: number;
}

interface AddToBagClientProps {
    productId: string;
    sizes: SizeWithStock[];
    initialBookmarkState: boolean;
    userId: string | null;
}

const AddToBagClient: React.FC<AddToBagClientProps> = ({ productId, sizes, initialBookmarkState, userId }) => {
    const { toast } = useToast();
    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    // Mendapatkan stok untuk ukuran yang dipilih
    const selectedSize = sizes.find(size => size.id === selectedSizeId);
    const isSizeInStock = selectedSize ? selectedSize.stock > 0 : false;

    const maxQuantity = selectedSize?.stock || 1;

    useEffect(() => {
        if (quantity > maxQuantity) {
            setQuantity(maxQuantity);
        }
    }, [selectedSizeId, maxQuantity]);

    const handleSizeSelect = (sizeId: string) => {
        setSelectedSizeId(sizeId);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0 && value <= maxQuantity) {
            setQuantity(value);
        }
    };

    const handleAddToBag = async () => {
        if (!userId) {
            toast({
                variant: "destructive",
                description: "Silahkan anda login terlebih dahulu.",
            });
            return;
        }

        if (!selectedSizeId) {
            toast({
                variant: "destructive",
                description: "Silahkan pilih ukuran produk yang anda pilih.",
            });
            return;
        }

        if (!isSizeInStock) {
            toast({
                variant: "destructive",
                description: "Stock yang anda pilih habis.",
            });
            return;
        }

        setLoading(true);

        try {
            await addToBagAction({
                userId,
                productId,
                sizeId: selectedSizeId,
                quantity,
            });
            toast({
                variant: "default",
                description: "Added to Bag",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Failed to add to bag. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="max-sm:mx-auto max-sm:text-center">
                <h4 className="text-muted-foreground text-lg font-semibold">Select size</h4>
                <div className="flex flex-wrap gap-3 mt-2">
                    {sizes.map((size) => (
                        <div
                            key={size.id}
                            className="relative flex items-center justify-center"
                        >
                            <SizeButton
                                onClick={() => handleSizeSelect(size.id)}
                                selected={selectedSizeId === size.id}
                                className={`relative px-4 py-2 border rounded-md cursor-pointer ${selectedSizeId === size.id ? 'bg-primary text-white' : 'bg-background text-primary'}`}

                            >
                                {size.name}
                            </SizeButton>
                            <span
                                className={`absolute bottom-[-1.5rem] text-xs font-medium ${size.stock > 0 ? 'text-green-500' : 'text-red-500'} bg-background rounded-full px-2 py-1 whitespace-nowrap`}
                                style={{ left: '50%', transform: 'translateX(-50%)' }}
                            >
                                {size.stock > 99 ? '99+' : `Stock ${size.stock}`}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <label htmlFor="quantity" className="text-muted-foreground text-lg font-semibold">
                        Quantity
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mt-2 px-3 py-2 border rounded-md bg-background text-primary"
                        max={maxQuantity}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 max-sm:justify-center">
                <AddToBagButton
                    onClick={handleAddToBag}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'ADD TO BAG'}
                </AddToBagButton>
                <BookmarkButton
                    productId={productId}
                    initialState={{
                        isBookmarkedByUser: initialBookmarkState,
                    }}
                />
            </div>
        </div>
    );
};

export default AddToBagClient;
