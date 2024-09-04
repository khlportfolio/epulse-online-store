"use client"

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider"
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
    className?: string
}

const UserButton = ({ className }: UserButtonProps) => {
    const { user } = useSession();

    const queryClient = useQueryClient();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("flex-none rounded-full outline-none", className)}>
                    <UserAvatar avatarUrl={user?.avatarUrl} size={40} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Logged in as @{user?.username}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => {
                    queryClient.clear();
                    logout();
                }}>
                    <LogOutIcon className="mr-2 size-4" />
                    Logout
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton