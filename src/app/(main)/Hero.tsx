import HeroImage from "@/assets/logo-image.jpg"
import CoverImage from "@/assets/cover.png"
import Image from "next/image"

const Hero = () => {
    return (
        <section className="relative bg-background flex flex-col items-center justify-center">
            <div className="w-full">
                <Image
                    src={CoverImage}
                    alt="Hero Image"
                    width={1600}
                    height={900}
                    className="object-contain"
                    priority
                />
            </div>
            <div className="absolute z-10 text-center px-5 md:mt-40">
                <h1 className="text-background text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    Temukan Pakaian Terbaik Anda
                </h1>
                <p className="text-background text-sm md:text-base lg:text-xl mt-4 max-w-2xl mx-auto font-medium">
                    Temukan pilihan pakaian kami yang dirancang dengan gaya dan kenyamanan, ideal untuk semua acara.
                </p>
            </div>
        </section>
    )
}

export default Hero