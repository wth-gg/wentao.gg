import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Connect from "./components/Connect";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="pb-20">
        <Hero />
        <Projects />
        <Experience />
        <Education />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
