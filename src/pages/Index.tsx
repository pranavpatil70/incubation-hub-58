import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StartupGrid from "@/components/StartupGrid";
import FounderDirectory from "@/components/FounderDirectory";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <StartupGrid />
      <FounderDirectory />
      <Footer />
    </div>
  );
};

export default Index;
