"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Target, RotateCcw } from "lucide-react";
import Link from "next/link";

// Types
type Gender = "male" | "female";
type Unit = "kg" | "lbs";
type Event = "CL" | "EQ";
type Category = "PL" | "BN";
type ScoreType = "dots" | "ipfgl" | "wilks2";

interface ScoreResults {
  ipfGL: number;
  wilks2: number;
  dots: number;
  ipf: number;
  oldWilks: number;
}

// Conversion: 1 kg = 2.204623 lbs, so 1 lbs = 0.45359237 kg
const LBS_TO_KG = 1 / 2.204623;

// ============ SCORE CALCULATION FUNCTIONS ============
// All coefficients sourced from PowerOPPS iOS app

function calculateOldWilks(bodyWeight: number, weightLifted: number, isFemale: boolean): number {
  const maleCoeff = [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8];
  const femaleCoeff = [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8];

  const coeff = isFemale ? femaleCoeff : maleCoeff;
  const minbw = isFemale ? 26.51 : 40.0;
  const maxbw = isFemale ? 154.53 : 201.9;
  const bw = Math.min(Math.max(bodyWeight, minbw), maxbw);

  let denominator = coeff[0];
  for (let i = 1; i < coeff.length; i++) {
    denominator += coeff[i] * Math.pow(bw, i);
  }

  return (500 / denominator) * weightLifted;
}

function calculateNewWilks(bodyWeight: number, weightLifted: number, isFemale: boolean): number {
  const maleCoeff = [47.4617885411949, 8.47206137941125, 0.073694103462609, -1.39583381094385e-3, 7.07665973070743e-6, -1.20804336482315e-8];
  const femaleCoeff = [-125.425539779509, 13.7121941940668, -0.0330725063103405, -1.0504000506583e-3, 9.38773881462799e-6, -2.3334613884954e-8];

  const coeff = isFemale ? femaleCoeff : maleCoeff;
  const minbw = 40.0;
  const maxbw = isFemale ? 150.95 : 200.95;
  const bw = Math.min(Math.max(bodyWeight, minbw), maxbw);

  let denominator = coeff[0];
  for (let i = 1; i < coeff.length; i++) {
    denominator += coeff[i] * Math.pow(bw, i);
  }

  return (600 / denominator) * weightLifted;
}

function calculateDOTS(bodyWeight: number, weightLifted: number, isFemale: boolean): number {
  const maleCoeff = [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093];
  const femaleCoeff = [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706];

  const coeff = isFemale ? femaleCoeff : maleCoeff;
  const maxbw = isFemale ? 150.0 : 210.0;
  const bw = Math.min(Math.max(bodyWeight, 40.0), maxbw);

  let denominator = coeff[0];
  for (let i = 1; i < coeff.length; i++) {
    denominator += coeff[i] * Math.pow(bw, i);
  }

  return (500 / denominator) * weightLifted;
}

function calculateIPF(bodyWeight: number, weightLifted: number, isFemale: boolean, event: Event, category: Category): number {
  const competition = event + category;

  const coefficients: Record<string, Record<string, number[]>> = {
    male: {
      CLPL: [310.67, 857.785, 53.216, 147.0835],
      CLBN: [86.4745, 259.155, 17.5785, 53.122],
      EQPL: [387.265, 1121.28, 80.6324, 222.4896],
      EQBN: [133.94, 441.465, 35.3938, 113.0057],
    },
    female: {
      CLPL: [125.1435, 228.03, 34.5246, 86.8301],
      CLBN: [25.0485, 43.848, 6.7172, 13.952],
      EQPL: [176.58, 373.315, 48.4534, 110.0103],
      EQBN: [49.106, 124.209, 23.199, 67.4926],
    },
  };

  const gender = isFemale ? "female" : "male";
  const coeff = coefficients[gender][competition] || coefficients[gender]["CLPL"];

  if (bodyWeight < 40.0) return 0.0;

  const lnbw = Math.log(bodyWeight);
  const score = 500 + 100 * ((weightLifted - (coeff[0] * lnbw - coeff[1])) / (coeff[2] * lnbw - coeff[3]));
  return score < 0 ? 0.0 : score;
}

function calculateIPFGL(bodyWeight: number, weightLifted: number, isFemale: boolean, event: Event, category: Category): number {
  const competition = event + category;

  const coefficients: Record<string, Record<string, number[]>> = {
    male: {
      CLPL: [1199.72839, 1025.18162, 0.00921],
      CLBN: [320.98041, 281.40258, 0.01008],
      EQPL: [1236.25115, 1449.21864, 0.01644],
      EQBN: [381.22073, 733.79378, 0.02398],
    },
    female: {
      CLPL: [610.32796, 1045.59282, 0.03048],
      CLBN: [142.40398, 442.52671, 0.04724],
      EQPL: [758.63878, 949.31382, 0.02435],
      EQBN: [221.82209, 357.00377, 0.02937],
    },
  };

  const gender = isFemale ? "female" : "male";
  const coeff = coefficients[gender][competition] || coefficients[gender]["CLPL"];

  if (bodyWeight < 35.0) return 0.0;

  const power = -coeff[2] * bodyWeight;
  const score = weightLifted * (100 / (coeff[0] - coeff[1] * Math.exp(power)));
  return score < 0 ? 0.0 : score;
}

function calculateAllScores(bodyWeight: number, weightLifted: number, isFemale: boolean, event: Event, category: Category, isKG: boolean): ScoreResults {
  const bw = isKG ? bodyWeight : bodyWeight * LBS_TO_KG;
  const wl = isKG ? weightLifted : weightLifted * LBS_TO_KG;

  return {
    ipfGL: calculateIPFGL(bw, wl, isFemale, event, category),
    wilks2: calculateNewWilks(bw, wl, isFemale),
    dots: calculateDOTS(bw, wl, isFemale),
    ipf: calculateIPF(bw, wl, isFemale, event, category),
    oldWilks: calculateOldWilks(bw, wl, isFemale),
  };
}

function calculateTargetWeight(bodyWeight: number, targetScore: number, scoreType: ScoreType, isFemale: boolean, event: Event, category: Category, isKG: boolean): number {
  const bw = isKG ? bodyWeight : bodyWeight * LBS_TO_KG;
  let weightKG: number;

  if (scoreType === "dots") {
    const maleCoeff = [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093];
    const femaleCoeff = [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706];
    const coeff = isFemale ? femaleCoeff : maleCoeff;
    const maxbw = isFemale ? 150.0 : 210.0;
    const clampedBw = Math.min(Math.max(bw, 40.0), maxbw);

    let denominator = coeff[0];
    for (let i = 1; i < coeff.length; i++) {
      denominator += coeff[i] * Math.pow(clampedBw, i);
    }
    weightKG = targetScore * (denominator / 500);
  } else if (scoreType === "wilks2") {
    const maleCoeff = [47.4617885411949, 8.47206137941125, 0.073694103462609, -1.39583381094385e-3, 7.07665973070743e-6, -1.20804336482315e-8];
    const femaleCoeff = [-125.425539779509, 13.7121941940668, -0.0330725063103405, -1.0504000506583e-3, 9.38773881462799e-6, -2.3334613884954e-8];
    const coeff = isFemale ? femaleCoeff : maleCoeff;
    const maxbw = isFemale ? 150.95 : 200.95;
    const clampedBw = Math.min(Math.max(bw, 40.0), maxbw);

    let denominator = coeff[0];
    for (let i = 1; i < coeff.length; i++) {
      denominator += coeff[i] * Math.pow(clampedBw, i);
    }
    weightKG = targetScore * (denominator / 600);
  } else {
    const competition = event + category;
    const coefficients: Record<string, Record<string, number[]>> = {
      male: {
        CLPL: [1199.72839, 1025.18162, 0.00921],
        CLBN: [320.98041, 281.40258, 0.01008],
        EQPL: [1236.25115, 1449.21864, 0.01644],
        EQBN: [381.22073, 733.79378, 0.02398],
      },
      female: {
        CLPL: [610.32796, 1045.59282, 0.03048],
        CLBN: [142.40398, 442.52671, 0.04724],
        EQPL: [758.63878, 949.31382, 0.02435],
        EQBN: [221.82209, 357.00377, 0.02937],
      },
    };
    const gender = isFemale ? "female" : "male";
    const coeff = coefficients[gender][competition] || coefficients[gender]["CLPL"];

    const power = -coeff[2] * bw;
    const divisor = 100 / (coeff[0] - coeff[1] * Math.exp(power));
    weightKG = targetScore / divisor;
  }

  return isKG ? weightKG : weightKG / LBS_TO_KG;
}

// ============ UI COMPONENTS ============

function SegmentButton({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex bg-background rounded-lg p-0.5 sm:p-1 gap-0.5 sm:gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            value === opt.value ? "bg-accent text-white" : "text-muted hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ScoreCard({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className={`p-4 rounded-lg ${primary ? "bg-accent/10 border border-accent/20" : "bg-background"}`}>
      <div className="text-xs text-muted uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${primary ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, suffix }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; suffix?: string }) {
  return (
    <div>
      <label className="block text-sm text-muted mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors scroll-mt-20"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function PowerOPPS() {
  const [activeTab, setActiveTab] = useState<"scores" | "target">("scores");

  // Scores calculator state
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("kg");
  const [event, setEvent] = useState<Event>("CL");
  const [category, setCategory] = useState<Category>("PL");
  const [bodyWeight, setBodyWeight] = useState("");
  const [weightLifted, setWeightLifted] = useState("");
  const [results, setResults] = useState<ScoreResults | null>(null);
  const [error, setError] = useState("");

  // Target calculator state
  const [targetGender, setTargetGender] = useState<Gender>("male");
  const [targetUnit, setTargetUnit] = useState<Unit>("kg");
  const [targetEvent, setTargetEvent] = useState<Event>("CL");
  const [targetCategory, setTargetCategory] = useState<Category>("PL");
  const [targetBodyWeight, setTargetBodyWeight] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [scoreType, setScoreType] = useState<ScoreType>("dots");
  const [targetResult, setTargetResult] = useState<number | null>(null);
  const [targetError, setTargetError] = useState("");

  const handleCalculateScores = () => {
    setError("");
    const bw = parseFloat(bodyWeight);
    const wl = parseFloat(weightLifted);

    if (isNaN(bw) || bw <= 0) {
      setError("Enter a valid body weight");
      return;
    }
    if (isNaN(wl) || wl <= 0) {
      setError("Enter a valid weight lifted");
      return;
    }

    setResults(calculateAllScores(bw, wl, gender === "female", event, category, unit === "kg"));
  };

  const handleCalculateTarget = () => {
    setTargetError("");
    const bw = parseFloat(targetBodyWeight);
    const ts = parseFloat(targetScore);

    if (isNaN(bw) || bw <= 0) {
      setTargetError("Enter a valid body weight");
      return;
    }
    if (isNaN(ts) || ts <= 0) {
      setTargetError("Enter a valid target score");
      return;
    }

    setTargetResult(calculateTargetWeight(bw, ts, scoreType, targetGender === "female", targetEvent, targetCategory, targetUnit === "kg"));
  };

  const resetScores = () => {
    setBodyWeight("");
    setWeightLifted("");
    setResults(null);
    setError("");
  };

  const resetTarget = () => {
    setTargetBodyWeight("");
    setTargetScore("");
    setTargetResult(null);
    setTargetError("");
  };

  const unitLabel = unit.toUpperCase();
  const targetUnitLabel = targetUnit.toUpperCase();

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/#projects" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg font-bold">PowerOPPS</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        {/* Title - hidden on mobile when keyboard might be open */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Powerlifting Calculator</h2>
          <p className="text-muted text-xs sm:text-sm hidden sm:block">Calculate scores or find your target total</p>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex bg-card rounded-xl p-1 mb-4 sm:mb-6"
        >
          <button
            onClick={() => setActiveTab("scores")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "scores" ? "bg-accent text-white" : "text-muted hover:text-foreground"
            }`}
          >
            <Calculator size={18} />
            <span>Scores</span>
          </button>
          <button
            onClick={() => setActiveTab("target")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "target" ? "bg-accent text-white" : "text-muted hover:text-foreground"
            }`}
          >
            <Target size={18} />
            <span>Target</span>
          </button>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {activeTab === "scores" ? (
            <div className="bg-card rounded-xl p-4 sm:p-5 border border-border">
              <div className="space-y-3 sm:space-y-4">
                {/* Row 1: Gender & Units */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-sm text-muted mb-1.5 sm:mb-2">Gender</label>
                    <SegmentButton
                      options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
                      value={gender}
                      onChange={(v) => setGender(v as Gender)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5 sm:mb-2">Units</label>
                    <SegmentButton
                      options={[{ value: "kg", label: "KG" }, { value: "lbs", label: "LBS" }]}
                      value={unit}
                      onChange={(v) => setUnit(v as Unit)}
                    />
                  </div>
                </div>

                {/* Row 2: Event & Category */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-sm text-muted mb-1.5 sm:mb-2">Event</label>
                    <SegmentButton
                      options={[{ value: "CL", label: "Classic" }, { value: "EQ", label: "Equipped" }]}
                      value={event}
                      onChange={(v) => setEvent(v as Event)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5 sm:mb-2">Category</label>
                    <SegmentButton
                      options={[{ value: "PL", label: "Full Meet" }, { value: "BN", label: "Bench Only" }]}
                      value={category}
                      onChange={(v) => setCategory(v as Category)}
                    />
                  </div>
                </div>

                {/* Row 3: Weight inputs */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InputField label="Body Weight" value={bodyWeight} onChange={setBodyWeight} placeholder="0" suffix={unitLabel} />
                  <InputField label="Total Lifted" value={weightLifted} onChange={setWeightLifted} placeholder="0" suffix={unitLabel} />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                  onClick={handleCalculateScores}
                  className="w-full py-3 sm:py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                >
                  Calculate
                </button>
              </div>

              {/* Results */}
              {results && (
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Results</h3>
                    <button onClick={resetScores} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
                      <RotateCcw size={14} />
                      Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <ScoreCard label="IPF GL" value={results.ipfGL.toFixed(2)} primary />
                    <ScoreCard label="DOTS" value={results.dots.toFixed(2)} primary />
                    <ScoreCard label="Wilks 2.0" value={results.wilks2.toFixed(2)} primary />
                    <ScoreCard label="IPF Points" value={results.ipf.toFixed(2)} />
                    <ScoreCard label="Old Wilks" value={results.oldWilks.toFixed(2)} />
                  </div>

                  <p className="mt-3 text-xs text-muted">
                    {gender === "male" ? "Male" : "Female"} · {bodyWeight} {unitLabel} · {weightLifted} {unitLabel} total · {event === "CL" ? "Classic" : "Equipped"} · {category === "PL" ? "Full Meet" : "Bench Only"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-4 sm:p-5 border border-border">
              <div className="space-y-3 sm:space-y-4">
                {/* Row 1: Gender & Units */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-sm text-muted mb-1.5 sm:mb-2">Gender</label>
                    <SegmentButton
                      options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
                      value={targetGender}
                      onChange={(v) => setTargetGender(v as Gender)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5 sm:mb-2">Units</label>
                    <SegmentButton
                      options={[{ value: "kg", label: "KG" }, { value: "lbs", label: "LBS" }]}
                      value={targetUnit}
                      onChange={(v) => setTargetUnit(v as Unit)}
                    />
                  </div>
                </div>

                {/* Score Type */}
                <div>
                  <label className="block text-sm text-muted mb-1.5 sm:mb-2">Score Type</label>
                  <SegmentButton
                    options={[
                      { value: "dots", label: "DOTS" },
                      { value: "ipfgl", label: "IPF GL" },
                      { value: "wilks2", label: "Wilks 2.0" },
                    ]}
                    value={scoreType}
                    onChange={(v) => setScoreType(v as ScoreType)}
                  />
                </div>

                {/* Event & Category (IPF GL only) */}
                {scoreType === "ipfgl" && (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-sm text-muted mb-1.5 sm:mb-2">Event</label>
                      <SegmentButton
                        options={[{ value: "CL", label: "Classic" }, { value: "EQ", label: "Equipped" }]}
                        value={targetEvent}
                        onChange={(v) => setTargetEvent(v as Event)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-1.5 sm:mb-2">Category</label>
                      <SegmentButton
                        options={[{ value: "PL", label: "Full Meet" }, { value: "BN", label: "Bench Only" }]}
                        value={targetCategory}
                        onChange={(v) => setTargetCategory(v as Category)}
                      />
                    </div>
                  </div>
                )}

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InputField label="Body Weight" value={targetBodyWeight} onChange={setTargetBodyWeight} placeholder="0" suffix={targetUnitLabel} />
                  <InputField label="Target Score" value={targetScore} onChange={setTargetScore} placeholder="e.g. 400" suffix="pts" />
                </div>

                {targetError && <p className="text-red-500 text-sm text-center">{targetError}</p>}

                <button
                  onClick={handleCalculateTarget}
                  className="w-full py-3 sm:py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                >
                  Calculate
                </button>
              </div>

              {/* Result */}
              {targetResult !== null && (
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Required Total</h3>
                    <button onClick={resetTarget} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
                      <RotateCcw size={14} />
                      Reset
                    </button>
                  </div>

                  <div className="text-center p-5 bg-accent/10 rounded-xl border border-accent/20">
                    <div className="text-4xl font-bold text-accent tabular-nums">
                      {targetResult.toFixed(1)} <span className="text-xl">{targetUnitLabel}</span>
                    </div>
                    <p className="text-muted text-sm mt-1">to achieve {targetScore} {scoreType.toUpperCase()} points</p>
                  </div>

                  <p className="mt-3 text-xs text-muted">
                    {targetGender === "male" ? "Male" : "Female"} · {targetBodyWeight} {targetUnitLabel} body weight · {scoreType.toUpperCase()}
                    {scoreType === "ipfgl" && ` · ${targetEvent === "CL" ? "Classic" : "Equipped"} · ${targetCategory === "PL" ? "Full Meet" : "Bench Only"}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 bg-card rounded-xl border border-border"
        >
          <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-muted hover:text-foreground transition-colors">
            About the scoring systems
          </summary>
          <div className="px-5 pb-4 space-y-2 text-sm text-muted">
            <p><span className="text-foreground font-medium">IPF GL</span> — Official IPF scoring since 2020, uses exponential formulas.</p>
            <p><span className="text-foreground font-medium">DOTS</span> — Popular polynomial formula used by many federations.</p>
            <p><span className="text-foreground font-medium">Wilks 2.0</span> — Updated Wilks formula with 600 divisor.</p>
            <p><span className="text-foreground font-medium">IPF Points</span> — Traditional IPF logarithmic formula.</p>
            <p><span className="text-foreground font-medium">Old Wilks</span> — Original Wilks formula for historical comparison.</p>
            <p className="pt-2 mt-2 border-t border-border">
              Formulas sourced from the{" "}
              <a
                href="https://www.powerlifting.sport/fileadmin/ipf/data/ipf-formula/Models_Evaluation-I-2020.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                official documentation
              </a>
              {" "}by the{" "}
              <a
                href="https://www.powerlifting.sport/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                International Powerlifting Federation
              </a>
              .
            </p>
          </div>
        </motion.details>
      </div>
    </main>
  );
}
