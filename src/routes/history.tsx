import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Eye, X, Download } from "lucide-react";
import { Layout } from "@/components/Layout";
import { clearHistory, deleteScan, loadHistory } from "@/lib/history";
import type { ScanReport } from "@/lib/scanner";
import { formatBytes } from "@/lib/scanner";
import { ReportView } from "@/components/ReportView";
import { downloadReport } from "@/lib/pdf-report";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Specimen Ledger | MFSP Threat Observatory" },
      { name: "description", content: "Historical registry of all specimens inspected in the laboratory." },
    ],
  }),
  component: LedgerPage,
});

function LedgerPage() {
  const [items, setItems] = useState<ScanReport[]>([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<ScanReport | null>(null);

  useEffect(() => {
    const update = () => setItems(loadHistory());
    update();
    window.addEventListener("mfsp:history-changed", update);
    return () => window.removeEventListener("mfsp:history-changed", update);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((r) =>
      r.fileName.toLowerCase().includes(s) ||
      r.md5.includes(s) ||
      r.sha1.includes(s) ||
      r.sha256.includes(s) ||
      r.level.includes(s) ||
      (r.level === "dangerous" && s.includes("hostile")) ||
      (r.level === "suspicious" && s.includes("curious")) ||
      (r.level === "safe" && s.includes("benign"))
    );
  }, [items, q]);

  return (
    <Layout>
      <div className="space-y-8 font-mono">
        {/* Active Inspection Modal / Overlay */}
        {active && (
          <div className="fixed inset-0 bg-[#26244A]/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#E8DCC4] border-2 border-[#26244A] hard-shadow-lg rounded-2xl p-6 max-w-4xl w-full my-8 relative">
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 p-2 min-h-[44px] min-w-[44px] rounded-lg border-2 border-[#26244A] bg-[#F3EAD6] text-[#26244A] flex items-center justify-center hover:bg-[#E8DCC4]"
                aria-label="Close dossier"
              >
                <X className="size-5" />
              </button>
              <div className="pt-2">
                <ReportView report={active} onReset={() => setActive(null)} />
              </div>
            </div>
          </div>
        )}

        {/* Ledger Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#E0A526]">
              SPECIMEN LEDGER · LOCAL AUDIT TRAIL
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#26244A] tracking-tight mt-1">
              Specimen Ledger
            </h1>
            <p className="text-xs text-[#26244A]/80 mt-1">
              {items.length} specimens catalogued in this station's browser storage.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you certain you wish to purge all ledger records?")) {
                  clearHistory();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#26244A] bg-[#F3EAD6] text-[#B8431F] text-xs font-bold tracking-wider hover:bg-[#E8DCC4] transition-all min-h-[44px] self-start md:self-auto"
            >
              <Trash2 className="size-4" />
              <span>Purge Ledger</span>
            </button>
          )}
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#26244A]/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by filename, hash (SHA-256), or verdict (Benign, Curious, Hostile)..."
            className="w-full bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-[#26244A] placeholder:text-[#26244A]/50 focus:outline-none focus:ring-2 focus:ring-[#E0A526] min-h-[44px]"
          />
        </div>

        {/* Ledger Book Table with Ruled Lines */}
        {filtered.length === 0 ? (
          <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-12 text-center">
            <p className="font-serif text-xl sm:text-2xl text-[#26244A] font-bold">
              The ledger is empty. Nothing under glass yet.
            </p>
            <p className="text-xs text-[#26244A]/70 mt-2">
              {items.length === 0
                ? "Mount a file onto the Examine Table to record your first forensic specimen entry."
                : "No catalogued specimens match your current filter query."}
            </p>
          </div>
        ) : (
          <div className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[#26244A] text-[#F3EAD6] text-left text-[10px] uppercase tracking-widest border-b-2 border-[#26244A]">
                    <th className="p-4 w-16">Entry</th>
                    <th className="p-4">Specimen / Date</th>
                    <th className="p-4 hidden sm:table-cell">Size</th>
                    <th className="p-4 hidden lg:table-cell">Fingerprint (SHA-256)</th>
                    <th className="p-4 text-center">Verdict Stamp</th>
                    <th className="p-4 text-right">Dossier Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#26244A]/20 bg-[#F3EAD6]">
                  {filtered.map((r, idx) => {
                    const isH = r.level === "dangerous";
                    const isC = r.level === "suspicious";

                    const stampColor = isH
                      ? "border-[#B8431F] text-[#B8431F] bg-[#B8431F]/10"
                      : isC
                      ? "border-[#E0A526] text-[#26244A] bg-[#E0A526]/20"
                      : "border-[#2F7D6B] text-[#2F7D6B] bg-[#2F7D6B]/10";

                    const stampText = isH
                      ? "HOSTILE"
                      : isC
                      ? "CURIOUS"
                      : "BENIGN";

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-[#E8DCC4]/50 transition-colors"
                      >
                        {/* Entry Number */}
                        <td className="p-4 font-bold text-[#26244A]/60">
                          #{String(idx + 1).padStart(3, "0")}
                        </td>

                        {/* File / Date */}
                        <td className="p-4">
                          <p className="font-bold text-sm text-[#26244A] break-words max-w-xs">
                            {r.fileName}
                          </p>
                          <p className="text-[10px] text-[#26244A]/70 mt-0.5">
                            {new Date(r.scannedAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            · {new Date(r.scannedAt).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>

                        {/* Size */}
                        <td className="p-4 hidden sm:table-cell text-[#26244A]/80 font-semibold">
                          {formatBytes(r.fileSize)}
                        </td>

                        {/* SHA-256 Fingerprint */}
                        <td className="p-4 hidden lg:table-cell font-mono text-[11px] text-[#26244A]/80 max-w-[220px] truncate select-all">
                          {r.sha256}
                        </td>

                        {/* Rubber Stamp Verdict */}
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block font-mono font-black text-[11px] tracking-widest px-2.5 py-1 rounded border-2 transform -rotate-1 ${stampColor}`}
                          >
                            {stampText} {r.score}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActive(r)}
                              className="p-2 min-h-[44px] min-w-[44px] rounded border border-[#26244A]/30 bg-[#E8DCC4] text-[#26244A] hover:bg-[#F3EAD6] flex items-center justify-center transition-all"
                              title="Inspect dossier"
                              aria-label="Inspect dossier"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              onClick={() => downloadReport(r)}
                              className="p-2 min-h-[44px] min-w-[44px] rounded border border-[#26244A]/30 bg-[#E8DCC4] text-[#26244A] hover:bg-[#F3EAD6] flex items-center justify-center transition-all"
                              title="Save dossier (PDF)"
                              aria-label="Save dossier PDF"
                            >
                              <Download className="size-4" />
                            </button>
                            <button
                              onClick={() => deleteScan(r.id)}
                              className="p-2 min-h-[44px] min-w-[44px] rounded border border-[#26244A]/30 bg-[#E8DCC4] text-[#B8431F] hover:bg-[#B8431F] hover:text-[#F3EAD6] flex items-center justify-center transition-all"
                              title="Delete record"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
