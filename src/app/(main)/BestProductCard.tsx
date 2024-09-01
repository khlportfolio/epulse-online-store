import Image from "next/image"

interface BestProductCardProps {
    src: string;
    title: string;
    description: string;
}
const BestProductCard = ({ src, title, description }: BestProductCardProps) => {
    return (
        <div className="bg-background overflow-hidden transform transition-transform hover:scale-105 duration-300 max-w-xs mx-auto">
            <div className="relative w-full h-80">
                <Image
                    src={src}
                    alt="Best Product Image"
                    fill
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="p-5">
                <h3 className="text-muted-foreground text-xl font-semibold mb-2">
                    {title}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default BestProductCard