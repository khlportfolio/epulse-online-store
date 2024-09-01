import SocialMediaCard from "./SocialMediaCard"

const SocialMedia = () => {
    return (
        <section className="bg-background px-5 sm:px-14">
            <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                Touch Us on Social Media
            </h2>
            <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                <SocialMediaCard src={require('../../assets/icon-instagram.png').default} href="/" title="Discover Style Daily on Instagram" description="Follow us on Instagram for a daily dose of fashion inspiration, exclusive sneak peeks, and the latest trends. Get closer to our brand and be the first to see what’s new." />
                <SocialMediaCard src={require('../../assets/icon-facebook.png').default} href="/" title="Join Our Community on Facebook" description="Like our Facebook page to stay updated with our newest collections, special promotions, and events. Engage with us and share your style stories with a community that loves fashion as much as you do." />
                <SocialMediaCard src={require('../../assets/icon-twitter.png').default} href="/" title="Catch the Latest Buzz on Twitter" description="Follow us on Twitter for real-time updates, quick style tips, and engaging conversations. Don’t miss out on exclusive announcements and flash sales—stay in the loop with every tweet." />
                <SocialMediaCard src={require('../../assets/icon-tiktok.png').default} href="/" title="See Fashion in Motion on TikTok" description="Follow us on TikTok for fun, dynamic content that brings our styles to life. From fashion tips to behind-the-scenes moments, discover our collection in a whole new way." />
            </div>
        </section>
    )
}

export default SocialMedia