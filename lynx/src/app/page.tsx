import Navbar from "@/components/navbar/navbar";
import { HeroImage } from "@/components/landing/heroimage";
import HeroSection from "@/components/landing/herosection";
import Features from "@/components/landing/features";


export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <HeroImage />
      <Features />
    </div>
  );
}
