import BgGradient from "@/components/common/bg-gradient";
import HeroSection from "../components/home/hero-section";

export default function Home() {
  return (
    <div className="relative w-f">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
      </div>
    </div>
  );
}
