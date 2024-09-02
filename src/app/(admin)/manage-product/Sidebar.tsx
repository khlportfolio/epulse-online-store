"use client"

import kyInstance from '@/lib/ky';
import { decryptKey } from '@/lib/utils';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Home, Shirt, Star, Info, ShoppingBag, Tag, Calendar, Globe, User, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// interface MenuItem {
//     title: string;
//     icon: React.ReactNode;
//     href: string;
// }

// const menuItems: MenuItem[] = [
//     { title: 'Home', icon: <Home />, href: '/admin' },
//     { title: 'Shirt', icon: <Shirt />, href: '/manage-product/shirt' },
//     { title: 'T-Shirt', icon: <ShoppingBag />, href: '/t-shirt' },
//     { title: 'Jacket', icon: <Tag />, href: '/jacket' },
//     { title: 'Hoodies', icon: <Calendar />, href: '/hoodies' },
//     { title: 'Pants', icon: <Globe />, href: '/pants' },
//     { title: 'Polo Shirt', icon: <User />, href: '/polo-shirt' },
// ];

type Category = {
    id: string;
    name: string;
};

const Sidebar = () => {
    const { isLoading, isError, data, error }: UseQueryResult<Category[], Error> = useQuery({
        queryKey: ['category-content'],
        queryFn: () => kyInstance.get("/api/category/all").json<Category[]>()
    });

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

    if (isLoading) {
        return (
            <aside className="sticky top-0 bg-gray-200 text-primary w-64 p-4 min-h-screen flex flex-col shadow-lg">
                {/* Loader or spinner */}
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </aside>
        )
    }

    return (
        <aside className="sticky top-0 bg-gray-200 text-primary w-64 p-4 min-h-screen flex flex-col shadow-lg">
            <nav className="flex-grow">
                <ul className="space-y-4">
                    <Link href="/admin" className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 font-semibold`}>
                        Home Dashboard
                    </Link>
                    {data?.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={`/manage-product/${item.id}`}
                                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${pathname === `/manage-product/${item.id}`
                                    ? 'bg-primary text-white shadow-md'
                                    : 'hover:bg-gray-300'
                                    }`}
                            >
                                <span className="font-semibold">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-5">
                <button className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-gray-300 rounded-md transition-all duration-300" onClick={handleLogout}>
                    <LogOut className="text-xl" />
                    <span className="font-semibold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
