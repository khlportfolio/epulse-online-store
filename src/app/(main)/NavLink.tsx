"use client";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import kyInstance from "@/lib/ky";
import { AllCategoriesData } from "@/lib/types";
import { NavLinkItem } from "@/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react"; // Import Skeleton from Shadcn

// Define the expected type for the data returned by the API
type Category = {
    id: string;
    name: string;
};

const NavLink = () => {
    // UseQueryResult<Category[], Error> defines that the data is an array of Category and error is an instance of Error
    const { isLoading, isError, data, error }: UseQueryResult<Category[], Error> = useQuery({
        queryKey: ['category-content'],
        queryFn: () => kyInstance.get("/api/category/all").json<Category[]>()
    });

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-3">
                <div className="hidden md:flex items-center justify-center py-5 gap-8">
                    <Skeleton className="h-6 w-24 bg-gray-200" /> {/* Example skeleton for the loading state */}
                    <Skeleton className="h-6 w-24 bg-gray-200" />
                    <Skeleton className="h-6 w-24 bg-gray-200" />
                </div>

                <div className="md:hidden flex items-center">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <button className="text-muted-foreground" onClick={toggleMenu}>
                                <Menu size={24} />
                                <span className="text-muted-foreground">Open Item</span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-5">
                            <SheetHeader className="mb-8">
                                <SheetTitle>Choose from our category</SheetTitle>
                                <SheetDescription>
                                    This is all categories that we have in our store. Choose your dream clothes.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col items-start gap-5">
                                <Skeleton className="h-6 w-32 bg-gray-200" /> {/* Skeleton for mobile menu items */}
                                <Skeleton className="h-6 w-32 bg-gray-200" />
                                <Skeleton className="h-6 w-32 bg-gray-200" />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        );
    }

    if (isError) {
        return <span>{error.message}</span>; // TypeScript now knows that error has a message property
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-3">
            <div className="hidden md:flex items-center justify-center py-5 gap-8">
                {data?.map((item) => (
                    <Link key={item.id} href={`/${item.id}`} className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base truncate max-w-xs md:max-w-sm"
                        title={item.name}>
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="md:hidden flex items-center">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <button className="text-muted-foreground flex flex-col items-center text-center" onClick={toggleMenu}>
                            <Menu size={24} />
                            <span className="text-muted-foreground">Open Item</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-5">
                        <SheetHeader className="mb-8">
                            <SheetTitle>Choose from our category</SheetTitle>
                            <SheetDescription>
                                This is all categories that we have in our store. Choose your dream clothes.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col items-start gap-5">
                            {data?.map((item) => (
                                <SheetClose asChild key={item.name}>
                                    <Link href={`/${item.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors truncate max-w-xs"
                                        title={item.name}>
                                        {item.name}
                                    </Link>
                                </SheetClose>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default NavLink;
