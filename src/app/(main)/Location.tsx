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
                    <h2 className="text-muted-foreground md:text-2xl lg:text-4xl font-semibold mb-4">Kunjungi Toko Kami</h2>
                    <hr className="border-muted-foreground border-t-2 w-36 my-3" />
                    <p className="text-muted-foreground text-base">
                        Terletak strategis di jantung kota yang ramai, toko kami menjadi destinasi ideal bagi Anda yang ingin mengeksplorasi koleksi pakaian dengan kualitas premium. Dengan suasana yang nyaman dan pelayanan yang ramah, kami berkomitmen untuk memberikan pengalaman berbelanja yang menyenangkan dan memuaskan. Tim kami yang profesional siap membantu Anda menemukan pilihan fashion terbaik yang sesuai dengan gaya dan kebutuhan Anda. Kunjungi toko kami dan temukan sentuhan elegan dari koleksi eksklusif kami, dirancang untuk membuat Anda tampil memukau di setiap kesempatan.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Location