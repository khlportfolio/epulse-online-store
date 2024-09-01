import ProductCard from "@/components/ProductCard"

const Shirts = () => {
    return (
        <section className="py-3 bg-background px-5 sm:px-14 sm:py-10">
            <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                Here Are Our Shirts
            </h2>
            <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">
                <ProductCard href="/shirts/1" src={require('../../../assets/signup-image.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
                <ProductCard href="/" src={require('../../../assets/heritage.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
                <ProductCard href="/" src={require('../../../assets/man-short.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
                <ProductCard href="/" src={require('../../../assets/login-image.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
                <ProductCard href="/" src={require('../../../assets/signup-image.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
                <ProductCard href="/" src={require('../../../assets/signup-image.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
                <ProductCard href="/" src={require('../../../assets/signup-image.jpg')} title="Urban Vibes Shirt" price="Rp. 150.000" />
            </div>
        </section>
    )
}

export default Shirts