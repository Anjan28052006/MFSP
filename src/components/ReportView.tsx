import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import type { ScanReport } from "@/lib/scanner";
import { formatBytes } from "@/lib/scanner";
import { downloadReport } from "@/lib/pdf-report";

interface ReportViewProps {
  report: ScanReport;
  specimenNo?: number;
  onReset?: () => void;
}

export function ReportView({ report, specimenNo = 1, onReset }: ReportViewProps) {
  const isHostile = report.level === "dangerous";
  const isCurious = report.level === "suspicious";
  const isBenign = report.level === "safe";

  const verdictLabel = isHostile
    ? "VERDICT: HOSTILE"
    : isCurious
    ? "VERDICT: CURIOUS"
    : "VERDICT: BENIGN";

  const verdictColor = isHostile
    ? "#B8431F"
    : isCurious
    ? "#E0A526"
    : "#2F7D6B";

  const verdictBg = isHostile
    ? "bg-[#B8431F] text-[#F3EAD6]"
    : isCurious
    ? "bg-[#E0A526] text-[#26244A]"
    : "bg-[#2F7D6B] text-[#F3EAD6]";

  // Plain English summary
  const summary = (() => {
    if (report.findings.some((f) => f.id === "ext-double")) {
      return "wearing a PDF's costume over an executable's body";
    }
    if (report.findings.some((f) => f.id === "ext-hidden")) {
      return "uses right-to-left character trickery to disguise its true binary format";
    }
    if (report.findings.some((f) => f.id === "script-obfuscation")) {
      return "contains obfuscated script routines designed to unpack hidden payloads";
    }
    if (report.findings.some((f) => f.id === "macro-indicator")) {
      return "contains embedded auto-executing VBA macros commonly used in droppers";
    }
    if (report.findings.some((f) => f.id.startsWith("name-"))) {
      return "matches known software piracy and exploit toolkit naming patterns";
    }
    if (report.findings.some((f) => f.id === "ext-dangerous")) {
      return "executable binary capable of running arbitrary native machine instructions";
    }
    if (isBenign) {
      return "clean structural attributes. No malicious heuristics detected";
    }
    return "exhibits elevated structural flags requiring manual forensic review";
  })();

  const specimenNumberStr = `SPECIMEN No. ${String(specimenNo).padStart(4, "0")}`;
  const receivedDate = new Date(report.scannedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
  const receivedTime = new Date(report.scannedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Total semicircle arc length: PI * radius (radius = 65) ~= 204.2
  const arcLength = Math.PI * 65;
  const strokeDashoffset = arcLength - (report.score / 100) * arcLength;

  return (
    <div className="space-y-6">
      {/* Top Header metadata */}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#B8431F]">
          {specimenNumberStr} · RECEIVED {receivedDate}, {receivedTime}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#26244A] mt-1.5">
          Place the file under glass.{" "}
          <span className="italic text-[#B8431F] font-serif font-normal">
            We'll tell you what it's hiding.
          </span>
        </h1>
      </div>

      {/* Main Grid: Left Specimen Box + Right Verdict Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: 8 Columns */}
        <div className="lg:col-span-8 bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            {/* Semicircle Gauge & Verdict */}
            <div className="flex flex-col items-center flex-shrink-0 w-[180px]">
              <div className="relative w-[180px] h-[105px] flex items-end justify-center overflow-visible">
                <svg viewBox="0 0 160 95" className="w-full h-full overflow-visible">
                  {/* Background Track */}
                  <path
                    d="M 15 85 A 65 65 0 0 1 145 85"
                    fill="none"
                    stroke="#E8DCC4"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  {/* Colored Value Arc */}
                  <motion.path
                    d="M 15 85 A 65 65 0 0 1 145 85"
                    fill="none"
                    stroke={verdictColor}
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    initial={{ strokeDashoffset: arcLength }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                {/* Score Number in Fraunces */}
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
                  <span className="font-serif text-5xl font-black text-[#26244A] tracking-tighter">
                    {report.score}
                  </span>
                </div>
              </div>

              {/* Verdict Pill with Stamp-In Animation */}
              <div className="mt-4 animate-stamp">
                <span
                  className={`px-4 py-1.5 rounded-md text-[11px] font-mono font-bold tracking-widest uppercase border-2 border-[#26244A] ${verdictBg}`}
                >
                  {verdictLabel}
                </span>
              </div>
            </div>

            {/* Right: Filename, size, summary & Indicators */}
            <div className="flex-1 min-w-0 w-full">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#26244A] truncate">
                {report.fileName}
              </h2>
              <p className="text-xs text-[#26244A]/80 font-mono mt-1 leading-relaxed">
                <span className="font-semibold">{formatBytes(report.fileSize)}</span>
                <span className="mx-1.5">·</span>
                <span>{summary}</span>
              </p>

              {/* Triggered Indicators List */}
              <div className="mt-5 space-y-2">
                {report.findings.map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center py-2 px-3 bg-[#E8DCC4]/60 rounded border border-[#26244A]/20 text-xs font-mono text-[#26244A]"
                  >
                    <span className="font-medium truncate pr-2">{f.title}</span>
                    <span className="font-bold flex-shrink-0 text-sm">
                      +{f.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Columns (3 Stacked Color Cards) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          {/* Benign Card */}
          <div className="bg-[#2F7D6B] text-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-90 font-bold">
              BENIGN · 0-30
            </p>
            <p className="font-serif font-bold text-base sm:text-lg mt-1 text-[#FFFFFF]">
              Nothing worth a second look
            </p>
          </div>

          {/* Curious Card */}
          <div className="bg-[#E0A526] text-[#26244A] border-2 border-[#26244A] hard-shadow rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold opacity-90">
              CURIOUS · 31-70
            </p>
            <p className="font-serif font-bold text-base sm:text-lg mt-1 text-[#26244A]">
              Handle with tweezers
            </p>
          </div>

          {/* Hostile Card */}
          <div className="bg-[#B8431F] text-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-90 font-bold">
              HOSTILE · 71-100
            </p>
            <p className="font-serif font-bold text-base sm:text-lg mt-1 text-[#FFFFFF]">
              Do not open. Quarantine.
            </p>
          </div>
        </div>
      </div>

      {/* Fingerprint Card (SHA-256) */}
      <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-4 sm:p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-[#26244A]/70">
          FINGERPRINT · SHA-256
        </p>
        <p className="font-mono text-xs sm:text-sm text-[#26244A] font-semibold break-all tracking-wider mt-1.5 select-all">
          {report.sha256}
        </p>
      </div>

      {/* Bottom Strip: 6-Step Pipeline Strip + PDF Export Button */}
      <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t-2 border-[#26244A]/30">
        {/* 6-step pipeline strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 flex-1">
          {[
            { num: "01", label: "Select", done: true },
            { num: "02", label: "Inspect", done: true },
            { num: "03", label: "Buffer", done: true },
            { num: "04", label: "Hash", done: true },
            { num: "05", label: "Weigh", done: true },
            {
              num: "06",
              label: "Report",
              done: true,
              isHostile,
              isCurious,
              isBenign,
            },
          ].map((step) => {
            let labelColor = "text-[#26244A]";
            let barColor = "bg-[#26244A]";

            if (step.label === "Report") {
              if (isHostile) {
                labelColor = "text-[#B8431F] font-bold";
                barColor = "bg-[#B8431F]";
              } else if (isCurious) {
                labelColor = "text-[#E0A526] font-bold";
                barColor = "bg-[#E0A526]";
              } else {
                labelColor = "text-[#2F7D6B] font-bold";
                barColor = "bg-[#2F7D6B]";
              }
            }

            return (
              <div key={step.num} className="space-y-1">
                <div className={`h-1.5 w-full rounded-full ${barColor}`} />
                <p className={`text-[11px] font-mono tracking-wider ${labelColor}`}>
                  <span className="font-semibold">{step.num}</span> {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Reset & Save Dossier */}
        <div className="flex items-center gap-3 justify-end">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#26244A] bg-[#F3EAD6] text-[#26244A] text-xs font-mono font-semibold tracking-wider hover:bg-[#E8DCC4] transition-all min-h-[44px]"
            >
              <RotateCcw className="size-4" />
              <span>Examine Another</span>
            </button>
          )}

          <button
            onClick={() => downloadReport(report)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border-2 border-[#26244A] bg-[#26244A] text-[#F3EAD6] text-xs font-mono font-bold tracking-wider hover:bg-[#343161] shadow-[4px_4px_0px_#171530] transition-all min-h-[44px]"
          >
            <Download className="size-4" />
            <span>Save dossier (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
