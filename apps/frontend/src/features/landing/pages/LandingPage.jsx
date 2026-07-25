import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import SocialProof from "../components/SocialProof.jsx";
import Problem from "../components/Problem.jsx";
import Solution from "../components/Solution.jsx";
import FAQSection from "../components/FAQSection.jsx";


export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Solution />
        <FAQSection />
      </main>
    </div>
  );
}