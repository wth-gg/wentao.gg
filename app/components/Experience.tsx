"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";

interface Experience {
  title: string;
  company: string;
  logo?: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    title: "Data Engineer",
    company: "Meta",
    logo: "/images/profile/meta_logo.jpeg",
    period: "May 2024 - Present",
    location: "New York City, NY",
    description: [
      "Owned large-scale multi-device data infrastructure and pipeline development, enabling data-driven decisions to support AR Glasses and next-gen wearable product launches.",
      "Built a scalable contribution analysis framework powering tier-0 product analytics metrics from user- and device-level event data, enabling automated alerting and root-cause analysis across executive dashboards.",
      "Designed canonical validation datasets and a fault-tolerant framework, quantifying impacted users/devices and accelerating debugging of data integrity issues during launches.",
    ],
    technologies: ["Python", "SQL", "Java", "PHP", "Spark", "Presto"],
  },
  {
    title: "Data Engineer",
    company: "Cherre",
    logo: "/images/profile/cherre_logo.jpeg",
    period: "Nov 2022 - May 2024",
    location: "New York City, NY",
    description: [
      "Deployed transformer-based text classification and LLM extraction pipelines for real estate documents, achieving 95%+ accuracy through systematic evaluation and error analysis.",
      "Engineered and operated automated, TB-scale data pipelines across AWS and GCP, leveraging Docker and Kubernetes to improve scalability and deployment velocity.",
    ],
    technologies: ["Python", "SQL", "PyTorch", "Postgres", "BigQuery", "Airflow", "dbt", "AWS", "GCP", "Docker", "Kubernetes"],
  },
  {
    title: "Data Engineer",
    company: "Mashey",
    logo: "/images/profile/mashey_logo.jpeg",
    period: "Oct 2021 - Nov 2022",
    location: "Remote",
    description: [
      "Developed a property recommendation engine using 15+ features, improving user engagement by 40% and increasing search relevance.",
      "Architected cloud data warehouse infrastructure with near-real-time ingestion pipelines processing 10M+ property records daily.",
    ],
    technologies: ["Python", "SQL", "PyTorch", "Postgres", "BigQuery", "Airflow", "dbt", "AWS", "GCP", "Docker", "Kubernetes"],
  },
  {
    title: "Machine Learning Engineer",
    company: "Jefferson Street Technologies",
    logo: "/images/profile/jefferson_street_technologies_logo.jpeg",
    period: "May 2020 - Oct 2021",
    location: "Remote",
    description: [
      "Implemented predictive ML models for financial datasets, improving portfolio returns by 6% annually through rapid prototyping and evaluation.",
      "Built and productionized ML pipelines, reducing training time by 60% while maintaining 99.8% data quality.",
    ],
    technologies: ["Python", "SQL", "TensorFlow", "PyTorch", "RAG"],
  },
];

function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
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
          {index < experiences.length - 1 && (
            <div className="w-0.5 h-full bg-border absolute top-3 left-[5px]" />
          )}
        </div>

        {/* Card content */}
        <div className="flex-1 bg-card hover:bg-card-hover rounded-xl p-6 md:p-8 transition-all duration-300 border border-transparent hover:border-border hover:card-shadow group">
          <div className="flex items-center gap-4 mb-4">
            {experience.logo && (
              <div className="flex-shrink-0 w-12 h-12 bg-white">
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                {experience.company}
              </h3>
              <p className="text-accent font-medium">{experience.title}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-muted" />
              {experience.period}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-muted" />
              {experience.location}
            </span>
          </div>

          <ul className="space-y-2 mb-6">
            {experience.description.map((item, i) => (
              <li key={i} className="text-muted leading-relaxed pl-4 border-l border-border">
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium bg-muted/20 text-foreground rounded-full"
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
    <section id="experience" className="py-24 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Experience</h2>
          <div className="w-16 h-1 bg-accent" />
        </motion.div>

        <div ref={containerRef} className="space-y-8 md:space-y-10">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
