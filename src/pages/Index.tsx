import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StartupGrid from "@/components/StartupGrid";
import IncubationBenefits from "@/components/IncubationBenefits";
import FounderDirectory from "@/components/FounderDirectory";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <IncubationBenefits />
      <StartupGrid />
      <FounderDirectory />
      <Footer />
    </div>
  );
};

export default Index;
