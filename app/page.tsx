import dynamic from "next/dynamic";
import LandingList from "./_components/sections/landingList/LandingList";

const Hero = dynamic(() => import("./_components/sections/hero/Hero"));

export default function Home() {
  return (
    <main>
      <Hero />
      <LandingList />
    </main>
  );
}
