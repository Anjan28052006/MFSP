import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Microscope, TableProperties, ShieldAlert, ShieldCheck, HelpCircle, ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { loadHistory } from "@/lib/history";
import type { ScanReport } from "@/lib/scanner";
import { formatBytes } from "@/lib/scanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Observatory | MFSP Threat Observatory" },
      { name: "description", content: "Forensic dashboard tracking examined specimens, threat distribution, and risk chronologies." },
    ],
  }),
  component: ObservatoryPage,
});

function useHistory() {
  const [items, setItems] = useState<ScanReport[]>([]);
  useEffect(() => {
    const update = () => setItems(loadHistory());
    update();
    window.addEventListener("mfsp:history-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("mfsp:history-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return items;
}

function ObservatoryPage() {
  const history = useHistory();

  const stats = useMemo(() => {
    const total = history.length;
    const hostile = history.filter((h) => h.level === "dangerous").length;
    const curious = history.filter((h) => h.level === "suspicious").length;
    const benign = history.filter((h) => h.level === "safe").length;
    return { total, hostile, curious, benign };
  }, [history]);

  // Points for hand-drawn risk trend line
  const trendPoints = useMemo(() => {
    if (history.length === 0) {
      // Mock historical baseline if fresh
      return [
        { label: "Ref A", score: 15 },
        { label: "Ref B", score: 45 },
        { label: "Ref C", score: 85 },
        { label: "Ref D", score: 20 },
        { label: "Ref E", score: 95 },
      ];
    }
    // Take the last 7 specimens in chronological order
    return [...history].reverse().slice(-7).map((h, i) => ({
      label: `No. ${String(i + 1).padStart(2, "0")}`,
      score: h.score,
      name: h.fileName,
    }));
  }, [history]);

  // SVG dimensions for hand-drawn risk graph
  const svgW = 600;
  const svgH = 180;
  const padX = 40;
  const padY = 30;

  const points = useMemo(() => {
    if (trendPoints.length === 0) return [];
    const step = (svgW - padX * 2) / Math.max(1, trendPoints.length - 1);
    return trendPoints.map((pt, i) => {
      const x = padX + i * step;
      const y = svgH - padY - (pt.score / 100) * (svgH - padY * 2);
      return { x, y, score: pt.score, label: pt.label };
    });
  }, [trendPoints, svgW, svgH, padX, padY]);

  // Construct SVG path string with a slight organic curve
  const pathData = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  return (
    <Layout>
      <div className="space-y-8 font-mono">
        {/* Header / Intro Card */}
        <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#E0A526]">
                OBSERVATORY · REGIONAL TRIAGE METRICS
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#26244A] tracking-tight mt-1">
                Threat Observatory
              </h1>
              <p className="text-xs sm:text-sm text-[#26244A]/80 mt-2 max-w-xl leading-relaxed">
                Continuous field telemetry and threat classifications recorded by this workstation.
                Zero bytes leave the local browser environment.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/scan"
                className="flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-[#26244A] bg-[#26244A] text-[#F3EAD6] text-xs font-bold tracking-wider hover:bg-[#343161] shadow-[4px_4px_0px_#171530] transition-all min-h-[44px]"
              >
                <Microscope className="size-4" />
                <span>Examine Table</span>
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] text-[#26244A] text-xs font-bold tracking-wider hover:bg-[#F3EAD6] transition-all min-h-[44px]"
              >
                <TableProperties className="size-4" />
                <span>Specimen Ledger</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Index-Card Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Specimens */}
          <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-5 flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#26244A]/70 font-bold">
              <span>Specimens</span>
              <Microscope className="size-4 text-[#26244A]" />
            </div>
            <div className="font-serif text-5xl font-black text-[#26244A] tracking-tight my-1">
              {stats.total}
            </div>
            <p className="text-[10px] text-[#26244A]/70">Examined under glass</p>
          </div>

          {/* Benign */}
          <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-5 flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#2F7D6B] font-bold">
              <span>Benign</span>
              <ShieldCheck className="size-4 text-[#2F7D6B]" />
            </div>
            <div className="font-serif text-5xl font-black text-[#2F7D6B] tracking-tight my-1">
              {stats.benign}
            </div>
            <p className="text-[10px] text-[#26244A]/70">Score 0 – 30</p>
          </div>

          {/* Curious */}
          <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-5 flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#E0A526] font-bold">
              <span>Curious</span>
              <HelpCircle className="size-4 text-[#E0A526]" />
            </div>
            <div className="font-serif text-5xl font-black text-[#E0A526] tracking-tight my-1">
              {stats.curious}
            </div>
            <p className="text-[10px] text-[#26244A]/70">Score 31 – 70</p>
          </div>

          {/* Hostile */}
          <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-5 flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#B8431F] font-bold">
              <span>Hostile</span>
              <ShieldAlert className="size-4 text-[#B8431F]" />
            </div>
            <div className="font-serif text-5xl font-black text-[#B8431F] tracking-tight my-1">
              {stats.hostile}
            </div>
            <p className="text-[10px] text-[#26244A]/70">Score 71 – 100</p>
          </div>
        </div>

        {/* Hand-Drawn-Style Risk Trend Line */}
        <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8431F]">
                CHRONOLOGICAL RISK TELEMETRY
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#26244A]">
                Hand-Plotted Risk Trend
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#E0A526] border border-[#26244A]" />
                <span>Ochre: Specimen Node</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#B8431F]" />
                <span>Vermilion: Risk Path</span>
              </span>
            </div>
          </div>

          {/* SVG Field Notebook Graph */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] border-2 border-[#26244A] rounded-xl bg-[#E8DCC4] p-4 relative">
              {/* Ruled horizontal ledger lines */}
              <div className="absolute inset-x-4 top-[30px] bottom-[30px] flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-[#26244A]" />
                <div className="border-b border-[#26244A]" />
                <div className="border-b border-[#26244A]" />
                <div className="border-b border-[#26244A]" />
              </div>

              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-44 overflow-visible">
                {/* Hand-drawn style risk curve in vermilion */}
                {pathData && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#B8431F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points in ochre with deep indigo ink border */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6.5"
                      fill="#E0A526"
                      stroke="#26244A"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className="font-serif font-black text-xs fill-[#26244A]"
                    >
                      {pt.score}
                    </text>
                    <text
                      x={pt.x}
                      y={svgH - 8}
                      textAnchor="middle"
                      className="font-mono text-[10px] fill-[#26244A]/80 font-bold"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-[#26244A]/70 mt-3 text-right">
            {history.length === 0
              ? "*Displaying baseline demonstration curve until specimens are examined."
              : `*Plotted from the last ${points.length} consecutive specimen evaluations.`}
          </p>
        </div>

        {/* Recent Specimens Ledger Snippet */}
        <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif font-bold text-2xl text-[#26244A]">
              Recent Specimens in Ledger
            </h2>
            <Link
              to="/history"
              className="text-xs font-bold text-[#26244A] hover:underline flex items-center gap-1"
            >
              <span>View full ledger</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-[#26244A]/30 rounded-xl">
              <p className="font-serif text-lg text-[#26244A]">The ledger is empty. Nothing under glass yet.</p>
              <Link
                to="/scan"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#26244A] bg-[#26244A] text-[#F3EAD6] text-xs font-bold tracking-wider hover:bg-[#343161] min-h-[44px]"
              >
                <span>Mount first specimen</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#26244A]/20">
              {history.slice(0, 4).map((h) => {
                const isH = h.level === "dangerous";
                const isC = h.level === "suspicious";
                const stampBg = isH
                  ? "bg-[#B8431F] text-[#F3EAD6]"
                  : isC
                  ? "bg-[#E0A526] text-[#26244A]"
                  : "bg-[#2F7D6B] text-[#F3EAD6]";
                const stampLabel = isH ? "HOSTILE" : isC ? "CURIOUS" : "BENIGN";

                return (
                  <div key={h.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#26244A] truncate">{h.fileName}</p>
                      <p className="text-[10px] text-[#26244A]/70 mt-0.5">
                        {formatBytes(h.fileSize)} · {new Date(h.scannedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded text-[10px] font-bold border border-[#26244A] ${stampBg}`}>
                        {stampLabel} {h.score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
