"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 py-4 px-6 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">
            &copy; {currentYear} Wentao
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://linkedin.com/in/wentaohe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:your@email.com"
              className="text-muted hover:text-foreground transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
