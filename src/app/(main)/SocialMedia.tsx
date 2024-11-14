import SocialMediaCard from "./SocialMediaCard"

const SocialMedia = () => {
    return (
        <section className="bg-background px-5 sm:px-14">
            <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                Hubungi kami lewat sosial media
            </h2>
            <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                <SocialMediaCard src={require('../../assets/icon-instagram.png').default} href="https://instagram.com/epuiseid_" title="Temukan inspirasi lewat instagram" description="Ikuti kami di Instagram untuk inspirasi fashion harian, bocoran eksklusif, dan tren terbaru. Lebih dekat dengan brand kami dan jadilah yang pertama melihat apa yang baru." />
                <SocialMediaCard src={require('../../assets/icon-facebook.png').default} href="/" title="Gabung komunitas kami" description="Like halaman Facebook kami untuk mendapatkan pembaruan tentang koleksi terbaru, promosi spesial, dan acara menarik. Terlibatlah dengan kami dan bagikan kisah gaya Anda dengan komunitas yang sama-sama mencintai fashion seperti Anda." />
                <SocialMediaCard src={require('../../assets/icon-twitter.png').default} href="/" title="Dapatkan update terbaru lewat twitter" description="Follow kami di Twitter untuk pembaruan real-time, tips gaya cepat, dan percakapan seru. Jangan lewatkan pengumuman eksklusif dan penjualan kilat—tetap terhubung dengan setiap tweet." />
                <SocialMediaCard src={require('../../assets/icon-tiktok.png').default} href="/" title="Liat fashion terbaru lewat tiktok kami" description="Follow kami di Twitter untuk pembaruan real-time, tips gaya cepat, dan percakapan seru. Jangan lewatkan pengumuman eksklusif dan penjualan kilat—tetap terhubung dengan setiap tweet." />
            </div>
        </section>
    )
}

export default SocialMedia