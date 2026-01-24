"use client";

import { motion } from "framer-motion";
import { ExternalLink, Dumbbell, Video } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "PowerOPPS",
    description:
      "A powerlifting index calculator that computes performance scores across 5 standardized systems (IPF GL, DOTS, Wilks 2.0, IPF, Old Wilks) with reverse calculation for target planning.",
    technologies: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    href: "/projects/poweropps",
    icon: Dumbbell,
  },
  {
    title: "What's my RPE?",
    description:
      "A velocity-based training tool using pose estimation and optical flow to track barbell kinematics from video. Employs supervised learning on user-labeled lift data to predict RPE and estimate 1RM, with automatic lift classification for squat, bench, and deadlift.",
    technologies: ["PyTorch", "OpenCV", "MediaPipe", "FastAPI", "Next.js"],
    href: "/projects/whats-my-rpe",
    icon: Video,
    comingSoon: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Projects</h2>
          <div className="w-16 h-1 bg-accent" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project, index) => {
            const CardContent = (
              <>
                <div className="relative h-48 bg-background overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <project.icon className="w-12 h-12 text-accent/40 group-hover:text-accent/60 transition-colors" />
                  </div>
                  {project.comingSoon ? (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-muted/80 text-white text-xs font-medium rounded">
                      Coming Soon
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-accent rounded-full">
                        <ExternalLink size={20} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-medium bg-background text-muted rounded border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            );

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
              >
                {project.comingSoon ? (
                  <div className="group block bg-card rounded-xl overflow-hidden border border-transparent hover:border-border hover:card-shadow transition-all duration-300 h-full cursor-default">
                    {CardContent}
                  </div>
                ) : (
                  <Link
                    href={project.href}
                    className="group block bg-card rounded-xl overflow-hidden border border-transparent hover:border-border hover:card-shadow transition-all duration-300 h-full"
                  >
                    {CardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
