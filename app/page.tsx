import Navigation from "./components/Navigation";
import ScrollProgress from "./components/ScrollProgress";
import InteractiveEffects from "./components/InteractiveEffects";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import SiteStats from "./components/CommitHeatmap";
import Connect from "./components/Connect";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <InteractiveEffects />
      <Navigation />
      <main className="pb-20">
        <Hero />
        <Projects />
        <Experience />
        <Education />
        <SiteStats />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
