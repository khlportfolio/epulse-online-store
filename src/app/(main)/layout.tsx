import { validateRequest } from "@/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import NavLink from "./NavLink";
import SessionProvider from "./SessionProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await validateRequest();

    return (
        <SessionProvider value={session}>
            <div className="flex flex-col min-h-screen bg-background">
                <Suspense fallback={<Loader2 className="size-5 animate-spin text-muted-foreground" />}>
                    {/* @ts-ignore */}
                    <Navbar />
                </Suspense>
                <NavLink />
                <div className="w-full mx-auto">
                    {children}
                </div>
                <Footer />
                <Link href="/?admin=true" className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded shadow-lg">
                    Admin
                </Link>
            </div>
        </SessionProvider>
    )
}