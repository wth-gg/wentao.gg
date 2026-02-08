"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileSpreadsheet, Sheet, Table2, Lock } from "lucide-react";
import Link from "next/link";

const mockProgram = [
  { exercise: "Squat", sets: "4x5", weight: "315 lbs", rpe: "7.5", note: "Comp pause" },
  { exercise: "Bench Press", sets: "4x4", weight: "225 lbs", rpe: "8", note: "2ct pause" },
  { exercise: "Deadlift", sets: "3x3", weight: "405 lbs", rpe: "8.5", note: "Belt only" },
  { exercise: "Front Squat", sets: "3x6", weight: "225 lbs", rpe: "7", note: "Accessory" },
  { exercise: "Close Grip Bench", sets: "3x8", weight: "185 lbs", rpe: "7", note: "Accessory" },
];

export default function ProgDash() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/#projects"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-green-500" />
            ProgDash
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
            <FileSpreadsheet size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            ProgDash
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto">
            Load your powerlifting program from Google Sheets into a clean, readable training view.
          </p>
        </motion.div>

        {/* Sign in with Google Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white rounded-xl font-medium text-gray-700 border border-gray-200 shadow-sm cursor-not-allowed opacity-60 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.003 24.003 0 0 0 0 21.56l7.98-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Sign in with Google
          </button>
          <p className="text-center text-xs text-muted mt-2 flex items-center justify-center gap-1">
            <Lock size={12} />
            Google OAuth integration coming soon
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Lock, label: "Sign In", desc: "Google OAuth" },
              { icon: Sheet, label: "Load Sheet", desc: "Pick your program" },
              { icon: Table2, label: "Parse & View", desc: "Clean training UI" },
            ].map((step, i) => (
              <div
                key={step.label}
                className="text-center p-3 sm:p-4 bg-card rounded-xl border border-border"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 mb-2">
                  <step.icon size={18} className="text-green-500" />
                </div>
                <div className="text-xs sm:text-sm font-medium">{step.label}</div>
                <div className="text-xs text-muted mt-0.5">{step.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preview: Mock parsed program */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Week 1 — Day A</h3>
                <p className="text-xs text-muted">Preview of parsed program data</p>
              </div>
              <span className="px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500 rounded border border-green-500/20">
                Preview
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted uppercase tracking-wide">Exercise</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted uppercase tracking-wide">Sets</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted uppercase tracking-wide">Weight</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted uppercase tracking-wide">RPE</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted uppercase tracking-wide hidden sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProgram.map((row, i) => (
                    <tr
                      key={row.exercise}
                      className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-background/30"}`}
                    >
                      <td className="px-4 py-3 font-medium">{row.exercise}</td>
                      <td className="px-4 py-3 text-muted tabular-nums">{row.sets}</td>
                      <td className="px-4 py-3 tabular-nums">{row.weight}</td>
                      <td className="px-4 py-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          parseFloat(row.rpe) >= 8.5
                            ? "bg-red-500/10 text-red-500"
                            : parseFloat(row.rpe) >= 7.5
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-green-500/10 text-green-500"
                        }`}>
                          @{row.rpe}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs hidden sm:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {["Next.js", "TypeScript", "Google OAuth", "Google Sheets API", "Tailwind"].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium bg-card text-muted rounded-lg border border-border"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

