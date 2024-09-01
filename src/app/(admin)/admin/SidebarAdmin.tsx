"use client"

import kyInstance from '@/lib/ky';
import { decryptKey } from '@/lib/utils';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Home, Shirt, List, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    href: string;
}

type Category = {
    id: string;
    name: string;
};

const SidebarAdmin = () => {
    const { isLoading, isError, data }: UseQueryResult<Category[], Error> = useQuery({
        queryKey: ['category-content'],
        queryFn: () => kyInstance.get("/api/category/all").json<Category[]>()
    });

    const menuItems: MenuItem[] = [
        { title: 'Home', icon: <Home />, href: '/admin' },
        { title: 'Manage Product', icon: <Shirt />, href: data && data.length > 0 ? `/manage-product/${data[0].id}` : '#' },
        { title: 'Manage Details', icon: <List />, href: '/manage-details/category' },
    ];

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
        localStorage.removeItem('accessKey');
        // Redirect to the home page
        router.push('/');
    }

    if (isLoading) {
        return (
            <aside className="sticky top-0 bg-gray-200 text-primary w-64 p-4 min-h-screen flex flex-col shadow-lg">
                {/* Loader or spinner */}
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </aside>
        );
    }

    return (
        <aside className="sticky top-0 bg-gray-200 text-primary w-64 p-4 min-h-screen flex flex-col shadow-lg">
            <nav className="flex-grow">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${pathname === item.href
                                    ? 'bg-primary text-white shadow-md'
                                    : 'hover:bg-gray-300'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-semibold">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto">
                <button className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-gray-300 rounded-md transition-all duration-300" onClick={handleLogout}>
                    <LogOut className="text-xl" />
                    <span className="font-semibold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
