import { FooterLinks } from "@/utils"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="flex justify-between w-full px-5 sm:px-14 py-20 max-sm:flex-col max-sm:gap-y-10 max-sm:py-10">
            <div className="flex flex-wrap gap-x-20 gap-y-10 max-w-2xl max-sm:max-w-full">
                <div className="flex flex-col gap-2">
                    <h3 className="text-base text-primary font-semibold">About Us</h3>
                    {FooterLinks[0].map((item) => (
                        <Link href={item.route} key={item.title} className="text-muted-foreground">
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-base text-primary font-semibold">Help</h3>
                    {FooterLinks[1].map((item) => (
                        <Link href={item.route} key={item.title} className="text-muted-foreground">
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-base text-primary font-semibold">Contact Us</h3>
                    {FooterLinks[2].map((item) => (
                        <Link href={item.route} key={item.title} className="text-muted-foreground">
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-base text-primary font-semibold">Legal</h3>
                    {FooterLinks[3].map((item) => (
                        <Link href={item.route} key={item.title} className="text-muted-foreground">
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-2 -ms-9 max-sm:ms-0">
                    <h3 className="text-base text-primary font-semibold">Socials</h3>
                    <div className="flex items-center gap-x-3">
                        <Link href="https://instagram.com/epuiseid_">
                            <Image
                                src={require('../../assets/icon-instagram.png').default}
                                alt="Footer icon"
                                width={25}
                                height={25}
                                className="object-contain"
                            />
                        </Link>
                        <Link href="">
                            <Image
                                src={require('../../assets/icon-facebook.png').default}
                                alt="Footer icon"
                                width={25}
                                height={25}
                                className="object-contain"
                            />
                        </Link>
                        <Link href="">
                            <Image
                                src={require('../../assets/icon-twitter.png').default}
                                alt="Footer icon"
                                width={25}
                                height={25}
                                className="object-contain"
                            />
                        </Link>
                        <Link href="">
                            <Image
                                src={require('../../assets/icon-tiktok.png').default}
                                alt="Footer icon"
                                width={25}
                                height={25}
                                className="object-contain"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex items-end max-sm:mx-auto">
                <p className="text-primary font-semibold text-sm">©Epulse. All Right Reserved</p>
            </div>
        </footer>
    )
}

export default Footer