"use client"

import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { decryptKey } from '@/lib/utils';
import kyInstance from '@/lib/ky';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Category {
    id: string;
    name: string;
}

const MobileNavbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { data: categories, isLoading, isError } = useQuery({
        queryKey: ['category-content'],
        queryFn: () => kyInstance.get("/api/category/all").json<Category[]>()
    });

    const encryptedKey =
        typeof window !== "undefined"
            ? window.localStorage.getItem("accessKey")
            : null;

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey);

        if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
            redirect("/");
        }
    }, [encryptedKey]);

    const handleLogout = () => {
        // Clear the access key from local storage
        localStorage.removeItem('accessKey');
        // Redirect to the home page
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="fixed bottom-16 left-0 right-0 bg-gray-200 p-2 shadow-lg md:hidden z-50">
                {/* Loader or spinner */}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="fixed bottom-16 left-0 right-0 bg-gray-200 p-2 shadow-lg md:hidden z-50">
                {/* Error message */}
            </div>
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="fixed bottom-0 left-0 right-0 bg-gray-200 p-2 shadow-lg md:hidden">
                    <LogOut className="text-xl mx-auto" />
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
                    <SheetDescription>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 p-2 text-red-600 hover:bg-gray-300 rounded-md transition-all duration-300"
                        >
                            <LogOut className="text-xl" />
                            <span className="ml-2 font-semibold">Sign Out</span>
                        </button>
                    </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col items-center space-y-2 mt-4">
                    {categories?.map((item) => (
                        <Link key={item.id} href={`/manage-product/${item.id}`} className={`flex items-center justify-center p-2 transition-all duration-300 rounded-md ${pathname === `/manage-product/${item.id}`
                            ? 'bg-primary text-white shadow-md'
                            : 'hover:bg-gray-300'
                            }`}>
                            <span className="text-sm font-semibold">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNavbar;
