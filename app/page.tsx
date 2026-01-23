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
      <main>
        <Hero />
        <Education />
        <Experience />
        <Projects />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
