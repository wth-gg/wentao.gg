"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/wentaohe",
    icon: Linkedin,
    color: "hover:text-[#0077B5]",
    description: "Let's connect",
  },
  {
    name: "GitHub",
    href: "https://github.com/yourusername",
    icon: Github,
    color: "hover:text-white",
    description: "Check out my code",
  },
  {
    name: "Email",
    href: "mailto:your@email.com",
    icon: Mail,
    color: "hover:text-accent",
    description: "Drop me a message",
  },
];

export default function Connect() {
  return (
    <section id="connect" className="py-32 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let&apos;s Connect
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted text-lg max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities, interesting projects,
            or just having a chat about technology. Feel free to reach out!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.name !== "Email" ? "_blank" : undefined}
              rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group bg-card hover:bg-card-hover rounded-2xl p-8 text-center border border-transparent hover:border-border transition-all duration-300 ${link.color}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-2xl mb-4 group-hover:bg-accent/10 transition-colors">
                <link.icon
                  size={28}
                  className="text-muted group-hover:text-accent transition-colors"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                {link.name}
                <ArrowUpRight
                  size={18}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h3>
              <p className="text-muted text-sm">{link.description}</p>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted text-sm">
            Or send me an email directly at{" "}
            <a
              href="mailto:your@email.com"
              className="text-accent hover:underline"
            >
              your@email.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
