import SearchResults from "./SearchResults"

interface PageProps {
    searchParams: { q: string }
}

export default function Page({ searchParams: { q } }: PageProps) {
    return (
        <section className="py-3 bg-background px-5 sm:px-14 sm:py-10">
            <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold line-clamp-2 break-all">
                Search results for &quot;{q}&quot;
            </h2>
            <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
            <SearchResults query={q} />
        </section>
    )
}