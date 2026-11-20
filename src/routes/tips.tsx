import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ShieldAlert, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SECURITY_TIPS, THREAT_FEED } from "@/lib/threat-feed";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Field Notes & Wanted Board | MFSP Threat Observatory" },
      { name: "description", content: "Operational field notes, defensive hygiene, and active wanted adversary profiles." },
    ],
  }),
  component: FieldNotesPage,
});

function FieldNotesPage() {
  return (
    <Layout>
      <div className="space-y-10 font-mono">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#E0A526]">
            FIELD PROTOCOLS &amp; INTELLIGENCE DOSSIERS
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#26244A] tracking-tight mt-1">
            Field Notes &amp; Wanted Board
          </h1>
          <p className="text-xs sm:text-sm text-[#26244A]/80 mt-1 max-w-2xl leading-relaxed">
            Essential operational hygiene protocols recorded by laboratory examiners, followed by active
            high-risk malware signatures tracked globally.
          </p>
        </div>

        {/* Section 1: Field Notes (Numbered Index Cards) */}
        <div>
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#26244A] pb-2">
            <BookOpen className="size-5 text-[#26244A]" />
            <h2 className="font-serif text-2xl font-bold text-[#26244A]">
              Field Notes (Defensive Guidelines)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_TIPS.map((tip, i) => (
              <div
                key={i}
                className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-[#26244A]/20 pb-2 mb-3">
                  <span className="font-serif font-black text-sm text-[#B8431F] tracking-wider">
                    FIELD NOTE #{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#26244A]/60 tracking-widest">
                    LAB MANUAL
                  </span>
                </div>
                <p className="text-xs text-[#26244A] leading-relaxed font-medium">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Wanted Board (Poster-Style Cards) */}
        <div>
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#26244A] pb-2">
            <ShieldAlert className="size-5 text-[#B8431F]" />
            <h2 className="font-serif text-2xl font-bold text-[#26244A]">
              Wanted Board (Active Threat Intelligence)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {THREAT_FEED.map((t) => {
              const isCrit = t.severity === "critical";
              const isHigh = t.severity === "high";

              const bannerBg = isCrit
                ? "bg-[#B8431F] text-[#F3EAD6]"
                : isHigh
                ? "bg-[#E0A526] text-[#26244A]"
                : "bg-[#2F7D6B] text-[#F3EAD6]";

              const severityText = isCrit
                ? "CRITICAL BOUNTY"
                : isHigh
                ? "HIGH PRIORITY"
                : "ACTIVE NOTICE";

              return (
                <div
                  key={t.id}
                  className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-4 flex flex-col justify-between text-center relative overflow-hidden"
                >
                  {/* Poster Top Banner */}
                  <div
                    className={`text-[9px] font-mono font-black tracking-widest py-1 px-2 uppercase border-2 border-[#26244A] rounded mb-3 ${bannerBg}`}
                  >
                    ★ {severityText} ★
                  </div>

                  {/* Wanted Title */}
                  <div className="my-2">
                    <p className="font-serif font-black text-xs text-[#26244A]/60 tracking-[0.2em] uppercase">
                      WANTED ADVERSARY
                    </p>
                    <h3 className="font-serif font-black text-2xl text-[#26244A] tracking-tight mt-0.5">
                      {t.family}
                    </h3>
                  </div>

                  {/* Classification Specs */}
                  <div className="border-t border-b border-[#26244A]/20 py-2.5 my-2 space-y-1 text-left text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#26244A]/70 uppercase tracking-wider text-[9px] font-bold">Class:</span>
                      <span className="font-bold text-[#26244A]">{t.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#26244A]/70 uppercase tracking-wider text-[9px] font-bold">Sector:</span>
                      <span className="font-bold text-[#26244A]">{t.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#26244A]/70 uppercase tracking-wider text-[9px] font-bold">Activity:</span>
                      <span className="font-bold text-[#26244A]">{t.hoursAgo}h ago</span>
                    </div>
                  </div>

                  {/* Stamp Verdict at bottom */}
                  <div className="mt-2 text-center">
                    <span className="inline-block text-[10px] font-bold tracking-widest uppercase border border-[#26244A] px-2 py-0.5 rounded bg-[#E8DCC4] text-[#26244A]">
                      HOSTILE SIGNATURE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
