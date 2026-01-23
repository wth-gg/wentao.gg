"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin, Calendar } from "lucide-react";

interface Degree {
  degreeType: string;
  field: string;
  period: string;
  location: string;
}

interface Highlight {
  text: string;
  link?: string;
}

interface School {
  name: string;
  logo?: string;
  degrees: Degree[];
  highlights?: Highlight[];
}

const education: School[] = [
  {
    name: "University of Pennsylvania",
    degrees: [
      {
        degreeType: "Master of Science",
        field: "Robotics (Artificial Intelligence)",
        period: "May 2020",
        location: "Philadelphia, PA",
      },
    ],
    highlights: [{ text: "Research @ Perelman School of Medicine" }],
  },
  {
    name: "Carnegie Mellon University",
    degrees: [
      {
        degreeType: "Master of Science",
        field: "Mechanical Engineering",
        period: "Dec 2017",
        location: "Pittsburgh, PA",
      },
      {
        degreeType: "Bachelor of Science",
        field: "Mechanical Engineering",
        period: "May 2017",
        location: "Pittsburgh, PA",
      },
    ],
    highlights: [
      { text: "Research @ Experimental Biomechatronics Lab" },
      { text: "🏎️ Carnegie Mellon Racing", link: "https://www.carnegiemellonracing.org/" },
    ],
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
            {education.map((school, schoolIndex) => (
              <motion.div
                key={school.name}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: schoolIndex * 0.2 }}
                className="relative pl-8 border-l-2 border-border hover:border-accent transition-colors group"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-background border-2 border-border group-hover:border-accent rounded-full flex items-center justify-center transition-colors">
                  <GraduationCap
                    size={14}
                    className="text-muted group-hover:text-accent"
                  />
                </div>

                <div className="bg-card hover:bg-card-hover rounded-xl p-6 transition-colors">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                    {school.name}
                  </h3>

                  <div className="space-y-4">
                    {school.degrees.map((degree, degreeIndex) => (
                      <div
                        key={degreeIndex}
                        className={`${
                          school.degrees.length > 1 ? "pl-4 border-l border-border" : ""
                        }`}
                      >
                        <p className="font-medium mb-2">
                          <span className="text-accent">{degree.degreeType}</span>
                          <span className="text-foreground"> in {degree.field}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-muted" />
                            {degree.period}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-muted" />
                            {degree.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {school.highlights && school.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
                      {school.highlights.map((highlight) =>
                        highlight.link ? (
                          <a
                            key={highlight.text}
                            href={highlight.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs font-medium bg-muted/20 text-foreground rounded-full hover:bg-muted/30 transition-colors"
                          >
                            {highlight.text}
                          </a>
                        ) : (
                          <span
                            key={highlight.text}
                            className="px-3 py-1 text-xs font-medium bg-muted/20 text-foreground rounded-full"
                          >
                            {highlight.text}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
