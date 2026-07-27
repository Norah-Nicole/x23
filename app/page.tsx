import Image from "next/image";
import Hero from "@/components/Hero";
import WhoAreYou from "@/components/WhoAreYou";
import Projects from "@/components/Projects";
import Philosophy from "@/components/Philosophy";
import Archive from "@/components/Archive";
import Partners from "@/components/Partners";
import FinalCallToAction from "@/components/FinalCallToAction";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhoAreYou />
      <Projects />
      <Philosophy />
      <Archive />
      <Partners />
      <FinalCallToAction />
      <UpcomingEvents />
    </main>
  );
}