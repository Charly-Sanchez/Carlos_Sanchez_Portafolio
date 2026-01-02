import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import DisableInteractions from "@/components/DisableInteractions";
import SectionTransition from "@/components/SectionTransition";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <DisableInteractions />
      <StarryBackground />
      <SectionTransition />
      <FloatingChat />
      <div className="relative z-10">
        <Navbar />
        <main className="scroll-smooth">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

