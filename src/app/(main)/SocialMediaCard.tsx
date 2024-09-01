import Image from "next/image";
import Link from "next/link";

interface SocialMediaCardProps {
    src: string;
    href: string;
    title: string;
    description: string;
    className?: string;
}

const SocialMediaCard = ({ src, href, title, description, className }: SocialMediaCardProps) => {
    return (
        <Link href={href} className={`${className} overflow-hidden transform transition-transform hover:scale-105 duration-300 max-w-xs mx-auto`}>
            <div className="p-5 flex flex-col justify-center items-center text-center gap-5">
                <Image
                    src={src}
                    alt={title}
                    width={40}
                    height={40}
                    className="object-contain"
                />
                <h3 className="text-muted-foreground text-lg font-medium">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
        </Link>
    )
}

export default SocialMediaCard