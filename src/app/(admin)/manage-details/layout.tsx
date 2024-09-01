import MobileNavbar from "./MobileNavbar";
import Sidebar from "./Sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <div className="hidden sm:block">
                <Sidebar />
            </div>
            <MobileNavbar />
            <main className="flex-1 bg-gray-50 p-8">
                {children}
            </main>
        </div>
    )
}