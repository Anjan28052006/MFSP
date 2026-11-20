import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Sparkles, Microscope } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ScanAnimation } from "@/components/ScanAnimation";
import { ReportView } from "@/components/ReportView";
import { scanFile, type ScanReport } from "@/lib/scanner";
import { addScan, loadHistory } from "@/lib/history";
import { DEMO_FILES } from "@/lib/threat-feed";
import { toast } from "sonner";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Examine Table | MFSP Threat Observatory" },
      { name: "description", content: "Place a file under glass. Static heuristic file forensics entirely within your browser." },
    ],
  }),
  component: ScanPage,
});

const ACCEPTED = ".exe,.dll,.bat,.js,.vbs,.zip,.pdf,.docx,.apk,.cmd,.ps1,.scr,.doc,.xlsx";
const STAGES = [
  "Mounting specimen under glass",
  "Reading byte buffer",
  "Generating SHA-256 fingerprint",
  "Analyzing extension camouflage",
  "Evaluating heuristic risk weights",
  "Sealing forensic verdict",
];

function ScanPage() {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(STAGES[0]);
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [specimenNo, setSpecimenNo] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = loadHistory();
    setSpecimenNo(history.length + 1);
  }, []);

  const runScan = useCallback(async (file: File) => {
    setReport(null);
    setScanning(true);
    setProgress(0);
    setStage(STAGES[0]);

    let stageIdx = 0;
    const startedAt = Date.now();
    const minDuration = 1600;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(95, (elapsed / minDuration) * 95);
      setProgress(pct);
      const idx = Math.min(STAGES.length - 1, Math.floor((pct / 95) * STAGES.length));
      if (idx !== stageIdx) {
        stageIdx = idx;
        setStage(STAGES[idx]);
      }
    }, 70);

    try {
      const [result] = await Promise.all([
        scanFile(file),
        new Promise((r) => setTimeout(r, minDuration)),
      ]);
      window.clearInterval(interval);
      setProgress(100);
      setStage("Verdict Recorded");
      setTimeout(() => {
        setScanning(false);
        setReport(result);
        addScan(result);
        const history = loadHistory();
        setSpecimenNo(history.length);
        const verdictWord =
          result.level === "dangerous"
            ? "HOSTILE"
            : result.level === "suspicious"
            ? "CURIOUS"
            : "BENIGN";
        toast.success(`Dossier sealed: ${verdictWord} (${result.score}/100)`);
      }, 350);
    } catch (err) {
      window.clearInterval(interval);
      setScanning(false);
      toast.error("Examination failed: " + (err as Error).message);
    }
  }, []);

  const onFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    runScan(files[0]);
  };

  const runDemo = (idx: number) => {
    const d = DEMO_FILES[idx];
    const file = new File([d.content], d.name, { type: d.type });
    runScan(file);
  };

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Layout>
      <div className="space-y-8 font-mono">
        {/* If Report is ready, display the exact Examine Table view */}
        {report ? (
          <ReportView
            report={report}
            specimenNo={specimenNo}
            onReset={() => setReport(null)}
          />
        ) : (
          <div className="space-y-8">
            {/* Stage Header */}
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#B8431F]">
                SPECIMEN No. {String(specimenNo).padStart(4, "0")} · RECEIVED {currentDate}, {currentTime}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#26244A] mt-1.5">
                Place the file under glass.{" "}
                <span className="italic text-[#B8431F] font-serif font-normal">
                  We'll tell you what it's hiding.
                </span>
              </h1>
              <p className="text-xs text-[#26244A]/80 mt-2 max-w-2xl leading-relaxed">
                Drop any untrusted binary, script, or document onto the examination slide. All metadata,
                cryptographic digests, and heuristic weights are evaluated in-memory.
              </p>
            </div>

            {/* Scanning In Progress */}
            <AnimatePresence>
              {scanning && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ScanAnimation progress={progress} stage={stage} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop Target / Examination Stage */}
            {!scanning && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(e.dataTransfer.files); }}
                className={`bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-8 sm:p-14 text-center transition-all ${
                  dragging ? "scale-[1.01] bg-[#E8DCC4] border-[#B8431F]" : ""
                }`}
              >
                <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
                  <div className="size-16 rounded-full border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center hard-shadow-sm">
                    <Microscope className="size-7 text-[#26244A]" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-2xl text-[#26244A]">
                      Drop Specimen Onto Glass
                    </h2>
                    <p className="text-xs text-[#26244A]/80 mt-1">
                      Drag and drop your file here, or click to choose from local disk.
                    </p>
                  </div>

                  <p className="text-[11px] text-[#26244A]/70 uppercase tracking-wider font-semibold border-t border-b border-[#26244A]/20 py-1.5 w-full">
                    Supports .exe, .bat, .cmd, .ps1, .vbs, .js, .pdf, .docx, .xlsx, .zip, .apk
                  </p>

                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={ACCEPTED}
                    onChange={(e) => onFiles(e.target.files)}
                  />

                  <button
                    onClick={() => inputRef.current?.click()}
                    className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-[#26244A] bg-[#26244A] text-[#F3EAD6] text-xs font-mono font-bold tracking-wider hover:bg-[#343161] shadow-[4px_4px_0px_#171530] transition-all min-h-[44px]"
                  >
                    <FileUp className="size-4" />
                    <span>Select File for Examination</span>
                  </button>
                </div>
              </div>
            )}

            {/* Test Specimen Slides (Demo Files) */}
            {!scanning && (
              <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="size-4 text-[#E0A526]" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#26244A]">
                    Load Test Specimen Slide
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DEMO_FILES.map((d, i) => {
                    const isKnownDangerous = d.name.endsWith(".exe") || d.name.includes("macro") || d.name.endsWith(".js");
                    return (
                      <button
                        key={d.name}
                        onClick={() => runDemo(i)}
                        className="text-left p-3.5 rounded-lg bg-[#E8DCC4] border-2 border-[#26244A] hover:bg-[#F3EAD6] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all text-xs font-mono min-h-[44px] flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[#26244A] truncate">{d.name}</span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-[#26244A] ${
                              isKnownDangerous
                                ? "bg-[#B8431F] text-[#F3EAD6]"
                                : "bg-[#2F7D6B] text-[#F3EAD6]"
                            }`}
                          >
                            {isKnownDangerous ? "SUSPECT" : "BENIGN"}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#26244A]/70 mt-2 truncate">
                          {d.type || "binary payload"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
