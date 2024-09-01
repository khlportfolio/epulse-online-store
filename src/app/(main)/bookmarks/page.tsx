import { validateRequest } from "@/auth"
import { redirect } from "next/navigation";
import Bookmarks from "./Bookmarks"

const Page = async () => {
    const { user } = await validateRequest();

    if (!user) {
        redirect("/login")
    }
    return (
        <section className="py-3 bg-background px-5 sm:px-14 sm:py-10">
            <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                Here Are Your Favorites
            </h2>
            <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
            <Bookmarks />
        </section>
    )
}

export default Page