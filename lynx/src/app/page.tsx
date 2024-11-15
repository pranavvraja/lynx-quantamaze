import Navbar from "@/components/navbar/navbar";
import { HeroImage } from "@/components/landing/heroimage";
import HeroSection from "@/components/landing/herosection";
import Features from "@/components/landing/features";
import UploadImage from "@/components/uploadthing/page";
import { auth } from "@/auth";
import MaskPdfName from "@/components/masking/masking";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      <HeroSection />
      <HeroImage />
      <Features />
      {/* <MaskPdfName /> */}
      <UploadImage userId={session?.user.id} />
    </div>
  );
}
