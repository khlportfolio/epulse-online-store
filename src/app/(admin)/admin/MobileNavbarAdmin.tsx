"use client"

import { useEffect, useState } from 'react';
import { Home, Shirt, List, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { decryptKey } from '@/lib/utils';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import kyInstance from '@/lib/ky';

interface MenuItem {
    icon: React.ReactNode;
    href: string;
}

type Category = {
    id: string;
    name: string;
};

const MobileNavbarAdmin = () => {
    const { isLoading, isError, data, error }: UseQueryResult<Category[], Error> = useQuery({
        queryKey: ['category-content'],
        queryFn: () => kyInstance.get("/api/category/all").json<Category[]>()
    });

    const mobileMenuItems: MenuItem[] = [
        { icon: <Home className="text-xl" />, href: '/admin' },
        ...(data && data.length > 0 ? [
            { icon: <Shirt className="text-xl" />, href: `/manage-product/${data[0].id}` }
        ] : []),
        { icon: <List className="text-xl" />, href: '/manage-details/category' },
    ];

    const [showDropdown, setShowDropdown] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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
        localStorage.removeItem('accessKey')
        // Redirect to the home page
        router.push('/')
    }

    return (
        <div className="relative z-10">
            {/* Sign Out Dropdown */}
            {showDropdown && (
                <div className="fixed bottom-16 left-0 right-0 bg-gray-200 p-2 shadow-lg md:hidden z-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center p-2 w-full text-red-600 hover:bg-gray-300 rounded-md transition-all duration-300"
                    >
                        <LogOut className="text-xl" />
                        <span className="ml-2 font-semibold">Sign Out</span>
                    </button>
                </div>
            )}

            {/* Menu Button for Dropdown */}
            <button
                className="fixed bottom-16 left-0 right-0 bg-gray-200 p-2 shadow-lg md:hidden"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <LogOut className="text-xl mx-auto" />
            </button>

            {/* Mobile Navbar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-200 p-2 flex justify-center gap-7 items-center shadow-lg md:hidden">
                {mobileMenuItems.map((item, index) => (
                    <Link key={index} href={item.href} className={`flex items-center justify-center p-2 transition-all duration-300 rounded-full ${pathname === item.href
                        ? 'bg-primary text-white shadow-md'
                        : 'hover:bg-gray-300'
                        }`}>
                        {item.icon}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default MobileNavbarAdmin;
