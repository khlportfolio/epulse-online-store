import { validateRequest } from "@/auth"
import SearchField from "@/components/SearchField"
import UserButton from "@/components/UserButton"
import Link from "next/link"
import StoreLogo from "@/assets/logo-store.png"
import Image from "next/image"
import Favorite from "@/components/Favorite"
import ShoppingBag from "@/components/ShoppingBag"

const Navbar = async () => {
    const { user } = await validateRequest();
    return (
        <header className="sticky top-0 z-10 bg-card shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-5 px-5 py-3">
                <Link href="/" className="hidden sm:block">
                    <Image
                        src={StoreLogo}
                        alt="Store Logo"
                        width={70}
                        height={70}
                    />
                </Link>
                <SearchField />

                <div className="sm:ms-auto flex items-center gap-5">
                    <Favorite size={20} />
                    <ShoppingBag size={20} />
                    {user ? <UserButton /> : (
                        <Link href="/login" className="text-muted-foreground">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar