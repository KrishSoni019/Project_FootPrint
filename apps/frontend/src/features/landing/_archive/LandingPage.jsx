import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

/**
 * LandingPage
 * The public homepage — everything a visitor sees before signing in.
 * This component intentionally contains no styling and no logic of its
 * own: it exists purely to declare the page's section order, so the
 * overall structure is readable at a glance, like a table of contents.
 */
function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
