"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";

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
    logo: "/images/profile/University-of-Pennsylvania-Logo-PNG7.png",
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
    logo: "/images/profile/cmu-wordmark-square-w-on-r.png",
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

function EducationCard({
  school,
  index,
}: {
  school: School;
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
    [index % 2 === 0 ? -60 : 60, 0, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1]);

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
            className="w-3 h-3 bg-accent rounded-full z-10"
          />
          {index < education.length - 1 && (
            <div className="w-0.5 h-full bg-border absolute top-3 left-[5px]" />
          )}
        </div>

        {/* Card content */}
        <div className="flex-1 bg-card hover:bg-card-hover rounded-xl p-6 md:p-8 transition-all duration-300 border border-transparent hover:border-border hover:card-shadow group">
          <div className="flex items-center gap-4 mb-4">
            {school.logo && (
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-xl overflow-hidden p-1.5">
                <Image
                  src={school.logo}
                  alt={`${school.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
              {school.name}
            </h3>
          </div>

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
      </div>
    </motion.div>
  );
}

export default function Education() {
  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Education</h2>
          <div className="w-16 h-1 bg-accent" />
        </motion.div>

        <div className="space-y-8 md:space-y-10">
          {education.map((school, index) => (
            <EducationCard key={school.name} school={school} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
