"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap } from "lucide-react";

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    school: "Your University",
    period: "2020 - 2024",
    description:
      "Focused on software engineering, algorithms, and distributed systems. Participated in various hackathons and coding competitions.",
    achievements: ["Dean's List", "GPA: 3.8/4.0", "Research Assistant"],
  },
];

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
          <div className="w-20 h-1 bg-accent mb-12" />

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative pl-8 border-l-2 border-border hover:border-accent transition-colors group"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-background border-2 border-border group-hover:border-accent rounded-full flex items-center justify-center transition-colors">
                  <GraduationCap size={14} className="text-muted group-hover:text-accent" />
                </div>

                <div className="bg-card hover:bg-card-hover rounded-xl p-6 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    <span className="text-sm text-muted font-mono">
                      {edu.period}
                    </span>
                  </div>

                  <p className="text-accent font-medium mb-3">{edu.school}</p>
                  <p className="text-muted leading-relaxed mb-4">
                    {edu.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {edu.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
