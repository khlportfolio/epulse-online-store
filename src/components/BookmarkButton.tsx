"use client"

import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface BookmarkButtonProps {
    productId: string;
    initialState: BookmarkInfo
}

const BookmarkButton = ({ productId, initialState }: BookmarkButtonProps) => {
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const queryKey: QueryKey = ["bookmark-info", productId];

    const { data } = useQuery({
        queryKey,
        queryFn: () => kyInstance.get(`/api/product/${productId}/bookmark`).json<BookmarkInfo>(),
        initialData: initialState,
        staleTime: Infinity
    })

    const { mutate } = useMutation({
        mutationFn: () => data.isBookmarkedByUser ? kyInstance.delete(`/api/product/${productId}/bookmark`) : kyInstance.post(`/api/product/${productId}/bookmark`),
        onMutate: async () => {
            toast({
                description: `Product ${data.isBookmarkedByUser ? "un" : ""}bookmarked`
            })

            await queryClient.cancelQueries({ queryKey });

            const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

            queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
                isBookmarkedByUser: !previousState?.isBookmarkedByUser
            }))

            return { previousState }
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState)
            console.error(error)
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again."
            })
        },
    })

    return (
        <button onClick={() => mutate()} className="flex items-center gap-2">
            <Heart
                className={cn("size-5", data.isBookmarkedByUser && "fill-primary text-primary")}
            />
        </button>
    )
}

export default BookmarkButton