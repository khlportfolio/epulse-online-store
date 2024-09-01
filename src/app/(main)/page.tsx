import PassKeyModal from "@/components/PassKeyModal";
import AboutUs from "./AboutUs";
import BestProduct from "./BestProduct";
import Hero from "./Hero";
import Location from "./Location";
import SocialMedia from "./SocialMedia";

declare type SearchParamProps = {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === 'true';
  return (
    <main className="w-full flex flex-col gap-7">
      {isAdmin && (
        <PassKeyModal />
      )}
      <Hero />
      <BestProduct />
      <AboutUs />
      <Location />
      <SocialMedia />
    </main>
  );
}