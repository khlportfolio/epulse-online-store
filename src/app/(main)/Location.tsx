import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false
});

const Location = () => {
    return (
        <section className="bg-background py-10 px-5">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-8">
                <div className="flex-1 min-w-[300px] h-80">
                    <MapComponent />
                </div>

                <div className="flex-1 min-w-[300px] p-5 ">
                    <h2 className="text-muted-foreground text-2xl font-semibold mb-4">Visit Us in the Heart of the City</h2>
                    <hr className="border-muted-foreground border-t-2 w-36 my-3" />
                    <p className="text-muted-foreground text-base">
                        Conveniently located in the bustling city center, our store is the perfect destination to explore our latest collections in person. Come and experience the quality and style of [Your Brand Name] firsthand—our friendly team is here to assist you with all your fashion needs.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Location