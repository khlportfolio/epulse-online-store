"use client";

import { useState } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react"; // Icon loader untuk loading state
import { useToast } from "./ui/use-toast";

interface AddToBagButtonProps {
    children: React.ReactNode;
    onClick: () => Promise<void>; // Menggunakan async action
    disabled?: boolean; // Tambahkan properti disabled
}

const AddToBagButton = ({ children, onClick, disabled = false }: AddToBagButtonProps) => {
    const { user } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    async function handleClick() {
        if (!user) {
            toast({
                variant: "destructive",
                description: "You need to log in to add items to your bag.",
            });
            router.push("/login");
        } else {
            setLoading(true);
            try {
                await onClick();
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: "Failed to add to bag. Please try again.",
                });
                console.error("Failed to add to bag:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Button
            onClick={handleClick}
            disabled={loading} // Only disabled during loading
            className="rounded-lg bg-primary text-background text-sm w-full max-w-72"
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Adding...
                </div>
            ) : (
                children
            )}
        </Button>
    );
};

export default AddToBagButton;
