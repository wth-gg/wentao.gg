"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    title: "Software Engineer",
    company: "Tech Company",
    period: "2023 - Present",
    description:
      "Building scalable web applications and microservices. Leading frontend development initiatives and mentoring junior developers.",
    technologies: ["React", "TypeScript", "Node.js", "AWS"],
  },
  {
    title: "Software Engineering Intern",
    company: "Startup Inc",
    period: "Summer 2022",
    description:
      "Developed full-stack features for the main product. Implemented CI/CD pipelines and improved test coverage by 40%.",
    technologies: ["Python", "Django", "PostgreSQL", "Docker"],
  },
  {
    title: "Research Assistant",
    company: "University Lab",
    period: "2021 - 2022",
    description:
      "Conducted research on distributed systems and machine learning. Published papers on optimization algorithms.",
    technologies: ["Python", "TensorFlow", "Kubernetes", "Go"],
  },
];

function ExperienceCard({
  experience,
  index,
}: {
  experience: (typeof experiences)[0];
  index: number;
}) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -100 : 100, 0, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, x, scale }}
      className="relative"
    >
      <div className="flex items-start gap-6">
        {/* Timeline dot and line */}
        <div className="hidden md:flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-4 h-4 bg-accent rounded-full z-10"
          />
          {index < experiences.length - 1 && (
            <div className="w-0.5 h-full bg-border absolute top-4 left-[7px]" />
          )}
        </div>

        {/* Card content */}
        <div className="flex-1 bg-card hover:bg-card-hover rounded-2xl p-6 md:p-8 transition-all duration-300 border border-transparent hover:border-border group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold group-hover:text-accent transition-colors">
                {experience.title}
              </h3>
              <p className="text-accent font-medium mt-1">{experience.company}</p>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Briefcase size={16} />
              <span className="text-sm font-mono">{experience.period}</span>
            </div>
          </div>

          <p className="text-muted leading-relaxed mb-6">
            {experience.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-medium bg-background text-muted rounded-lg border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);

  return (
    <section id="experience" className="py-32 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <div className="w-20 h-1 bg-accent" />
        </motion.div>

        <div ref={containerRef} className="space-y-12 md:space-y-16">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
