import dynamic from "next/dynamic";
import LandingList from "./_components/sections/landingList/LandingList";
import Footer from "./_components/utils/Footer";

const Hero = dynamic(() => import("./_components/sections/hero/Hero"));

export default function Home() {
  return (
    <main>
      <Hero />
      <LandingList />
      <Footer />
    </main>
  );
}
