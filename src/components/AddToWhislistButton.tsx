"use client"

import { useSession } from "@/app/(main)/SessionProvider";
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"

interface AddToWhislistButtonProps {
    children: React.ReactNode
}

const AddToWhislistButton = ({ children }: AddToWhislistButtonProps) => {
    const { user } = useSession();
    const router = useRouter();

    function handleClick() {
        if (!user) {
            router.push('/login')
        } else {
            router.push('/bag')
        }
    }
    return (
        <Button onClick={handleClick} className="rounded-lg bg-background text-primary text-sm w-full max-w-72 flex gap-2 items-center border border-muted-foreground hover:bg-background">
            <Heart size={20} />
            {children}
        </Button>
    )
}

export default AddToWhislistButton