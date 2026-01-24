"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Dumbbell, Video } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects", hasDropdown: true },
  { name: "Connect", href: "#connect" },
];

const projectItems = [
  {
    name: "PowerOPPS",
    href: "/projects/poweropps",
    description: "Powerlifting index calculator",
    icon: Dumbbell,
  },
  {
    name: "What's my RPE?",
    href: "#projects",
    description: "Velocity-based RPE predictor (Coming Soon)",
    icon: Video,
    comingSoon: true,
  },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProjectsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProjectsOpen(false);
    }, 150);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.a
              href="#"
              className="text-xl font-semibold tracking-tight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              W.
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <div
                    key={item.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.button
                      className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                    >
                      {item.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isProjectsOpen ? "rotate-180" : ""}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {isProjectsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                        >
                          <div className="p-2">
                            <a
                              href={item.href}
                              className="block px-3 py-2 text-xs text-muted hover:text-foreground transition-colors"
                              onClick={() => setIsProjectsOpen(false)}
                            >
                              View All Projects
                            </a>
                            <div className="h-px bg-border my-1" />
                            {projectItems.map((project) => (
                              project.comingSoon ? (
                                <div
                                  key={project.name}
                                  className="flex items-center gap-3 px-3 py-3 rounded-lg opacity-60 cursor-default"
                                >
                                  <div className="p-2 bg-muted/10 rounded-lg">
                                    <project.icon size={18} className="text-muted" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-muted">{project.name}</div>
                                    <div className="text-xs text-muted">{project.description}</div>
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  key={project.name}
                                  href={project.href}
                                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background transition-colors group"
                                  onClick={() => setIsProjectsOpen(false)}
                                >
                                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                                    <project.icon size={18} className="text-accent" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{project.name}</div>
                                    <div className="text-xs text-muted">{project.description}</div>
                                  </div>
                                </Link>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                  </motion.a>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <div key={item.name} className="flex flex-col items-center">
                    <motion.button
                      className="flex items-center gap-2 text-2xl font-medium text-muted hover:text-foreground transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                    >
                      {item.name}
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${mobileProjectsOpen ? "rotate-180" : ""}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {mobileProjectsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 flex flex-col items-center gap-3"
                        >
                          <a
                            href={item.href}
                            className="text-sm text-muted hover:text-foreground transition-colors"
                            onClick={() => {
                              setMobileProjectsOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            View All Projects
                          </a>
                          {projectItems.map((project) => (
                            project.comingSoon ? (
                              <div
                                key={project.name}
                                className="flex items-center gap-3 px-4 py-3 bg-card/50 rounded-xl border border-border opacity-60"
                              >
                                <div className="p-2 bg-muted/10 rounded-lg">
                                  <project.icon size={20} className="text-muted" />
                                </div>
                                <div>
                                  <div className="font-medium text-muted">{project.name}</div>
                                  <div className="text-xs text-muted">{project.description}</div>
                                </div>
                              </div>
                            ) : (
                              <Link
                                key={project.name}
                                href={project.href}
                                className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border"
                                onClick={() => {
                                  setMobileProjectsOpen(false);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                <div className="p-2 bg-accent/10 rounded-lg">
                                  <project.icon size={20} className="text-accent" />
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">{project.name}</div>
                                  <div className="text-xs text-muted">{project.description}</div>
                                </div>
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-2xl font-medium text-muted hover:text-foreground transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
