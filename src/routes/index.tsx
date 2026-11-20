import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Microscope,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Lock,
  Binary,
  Layers,
  Zap,
  FileText,
  Award,
  ArrowRight,
  Sparkles,
  Compass,
  Menu,
  X,
  TableProperties,
  BookOpen,
} from "lucide-react";
import { DEMO_FILES } from "@/lib/threat-feed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MFSP / Threat Observatory | Forensic Malware Triage Laboratory" },
      {
        name: "description",
        content:
          "Client-side static file forensics, cryptographic fingerprinting, and quantitative threat heuristics. Built for UVCE & Honeywell Future Skills Edge.",
      },
    ],
  }),
  component: StandaloneLandingPage,
});

function StandaloneLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#E8DCC4] text-[#26244A] font-mono selection:bg-[#E0A526] selection:text-[#26244A]">
      {/* ========================================================= */}
      {/* STANDALONE TOP NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#26244A] text-[#F3EAD6] border-b-2 border-[#26244A] shadow-[0_4px_0_#171530]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif font-black text-2xl tracking-tight text-[#F3EAD6] group-hover:text-[#E0A526] transition-colors">
              MFSP
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#E0A526] uppercase">
              / Threat Observatory
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-xs font-semibold tracking-wider">
            <Link
              to="/scan"
              className="px-3 py-2 rounded-md hover:bg-[#343161] hover:text-[#FFFFFF] transition-all min-h-[40px] flex items-center"
            >
              Examine Table
            </Link>
            <Link
              to="/observatory"
              className="px-3 py-2 rounded-md hover:bg-[#343161] hover:text-[#FFFFFF] transition-all min-h-[40px] flex items-center"
            >
              Observatory
            </Link>
            <Link
              to="/history"
              className="px-3 py-2 rounded-md hover:bg-[#343161] hover:text-[#FFFFFF] transition-all min-h-[40px] flex items-center"
            >
              Specimen Ledger
            </Link>
            <Link
              to="/tips"
              className="px-3 py-2 rounded-md hover:bg-[#343161] hover:text-[#FFFFFF] transition-all min-h-[40px] flex items-center"
            >
              Field Notes
            </Link>
            <Link
              to="/scan"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-[#E0A526] bg-[#E0A526] text-[#26244A] font-bold hover:bg-[#F3EAD6] transition-all shadow-[2px_2px_0_#171530] min-h-[40px]"
            >
              <Microscope className="size-4" />
              <span>Launch Scanner</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded border border-[#3B3868] text-[#F3EAD6] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#26244A] border-t border-[#3B3868] p-4 flex flex-col gap-2">
            <Link
              to="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded text-xs font-semibold text-[#F3EAD6] hover:bg-[#343161] min-h-[44px] flex items-center"
            >
              Examine Table (Scanner)
            </Link>
            <Link
              to="/observatory"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded text-xs font-semibold text-[#F3EAD6] hover:bg-[#343161] min-h-[44px] flex items-center"
            >
              Observatory (Telemetry)
            </Link>
            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded text-xs font-semibold text-[#F3EAD6] hover:bg-[#343161] min-h-[44px] flex items-center"
            >
              Specimen Ledger (History)
            </Link>
            <Link
              to="/tips"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded text-xs font-semibold text-[#F3EAD6] hover:bg-[#343161] min-h-[44px] flex items-center"
            >
              Field Notes &amp; Wanted Board
            </Link>
            <Link
              to="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 rounded bg-[#E0A526] text-[#26244A] font-bold text-xs min-h-[44px] flex items-center justify-center"
            >
              Launch Examine Table
            </Link>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* MAIN LANDING BODY */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 space-y-12 sm:space-y-16">
        {/* HERO SECTION */}
        <section className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 opacity-5 pointer-events-none hidden sm:block">
            <Microscope className="size-96 text-[#26244A]" />
          </div>

          <div className="max-w-3xl relative z-10 space-y-5">
            {/* Academic Credential Tag */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full border border-[#26244A] bg-[#E8DCC4] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="size-2 rounded-full bg-[#B8431F] animate-ping" />
              <span>MFSP · 120 Hours Applied Security</span>
              <span className="text-[#26244A]/40">|</span>
              <span className="text-[#B8431F]">Honeywell &amp; UVCE</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#26244A] leading-[1.12]">
              Place the file under glass.{" "}
              <span className="italic font-serif text-[#B8431F] block sm:inline">
                We'll tell you what it's hiding.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm lg:text-base text-[#26244A]/80 leading-relaxed max-w-2xl">
              A rapid forensic triage workstation engineered to detect social engineering camouflages, compute
              cryptographic digests, and quantify threat probabilities without leaking sensitive files to external servers.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to="/scan"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#26244A] bg-[#26244A] text-[#F3EAD6] text-xs sm:text-sm font-bold tracking-wider hover:bg-[#343161] shadow-[4px_4px_0px_#171530] transition-all min-h-[48px]"
              >
                <Microscope className="size-4" />
                <span>Enter Examine Table</span>
                <ArrowRight className="size-4 ml-1" />
              </Link>
              <Link
                to="/observatory"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#26244A] bg-[#E8DCC4] text-[#26244A] text-xs sm:text-sm font-bold tracking-wider hover:bg-[#F3EAD6] transition-all min-h-[48px]"
              >
                <Compass className="size-4 text-[#26244A]" />
                <span>Open Observatory Station</span>
              </Link>
            </div>
          </div>
        </section>

        {/* QUICK TEST SPECIMEN SLIDES */}
        <section className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#E0A526]" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#26244A]">
                Quick Specimen Test Slides
              </h2>
            </div>
            <p className="text-[11px] text-[#26244A]/70">
              Click any specimen slide to mount it on the Examine Table:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_FILES.slice(0, 6).map((d) => {
              const isH = d.name.endsWith(".exe") || d.name.includes("macro") || d.name.endsWith(".js");
              return (
                <Link
                  key={d.name}
                  to="/scan"
                  className="p-3.5 rounded-xl bg-[#E8DCC4] border-2 border-[#26244A] hover:bg-[#F3EAD6] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[64px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate text-[#26244A]">{d.name}</span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#26244A] ${
                        isH ? "bg-[#B8431F] text-[#F3EAD6]" : "bg-[#2F7D6B] text-[#F3EAD6]"
                      }`}
                    >
                      {isH ? "HOSTILE LURE" : "BENIGN"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#26244A]/70 truncate mt-1">
                    {d.type || "executable payload"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 6-STEP EXAMINATION PIPELINE */}
        <section className="space-y-4">
          <div className="border-b-2 border-[#26244A] pb-2">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#E0A526]">
              METHODOLOGY · DROP TO DECISION
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26244A]">
              The 6-Step Forensic Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { num: "01", title: "SELECT", desc: "Drag & drop file or browse local disk" },
              { num: "02", title: "BUFFER", desc: "Load binary data into ArrayBuffer memory" },
              { num: "03", title: "HASH", desc: "Compute MD5, SHA-1, and SHA-256 digests" },
              { num: "04", title: "INSPECT", desc: "Scan first 256 KB text and extensions" },
              { num: "05", title: "WEIGH", desc: "Evaluate heuristic penalty weights" },
              { num: "06", title: "REPORT", desc: "Quantify risk verdict & generate PDF" },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-xl p-4 flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <span className="font-serif font-black text-2xl text-[#B8431F]">
                    {step.num}
                  </span>
                  <h3 className="font-bold text-xs tracking-wider mt-1 text-[#26244A]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[10px] text-[#26244A]/80 leading-relaxed mt-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* THREE VERDICT PILLARS */}
        <section className="space-y-4">
          <div className="border-b-2 border-[#26244A] pb-2">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#E0A526]">
              CLASSIFICATION TIERS
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26244A]">
              Three-Tier Triage Framework
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Benign */}
            <div className="bg-[#2F7D6B] text-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold opacity-90">
                  BENIGN · 0-30
                </p>
                <h3 className="font-serif font-bold text-2xl mt-1 text-[#FFFFFF]">
                  Nothing worth a second look
                </h3>
                <p className="text-xs text-[#F3EAD6]/90 mt-3 leading-relaxed">
                  File passed structural checks. Standard headers and common safe extensions. Keep operating
                  system and defensive signatures regularly updated.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#FFFFFF]/20 text-[10px] font-bold tracking-widest uppercase">
                STATUS: DISMISS
              </div>
            </div>

            {/* Curious */}
            <div className="bg-[#E0A526] text-[#26244A] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold opacity-90">
                  CURIOUS · 31-70
                </p>
                <h3 className="font-serif font-bold text-2xl mt-1 text-[#26244A]">
                  Handle with tweezers
                </h3>
                <p className="text-xs text-[#26244A]/90 mt-3 leading-relaxed">
                  Elevated heuristic flags triggered (e.g. macro indicators, unknown MIME type, or archive wrappers).
                  Isolate in a virtual sandbox before opening.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#26244A]/20 text-[10px] font-bold tracking-widest uppercase">
                STATUS: ISOLATE &amp; AUDIT
              </div>
            </div>

            {/* Hostile */}
            <div className="bg-[#B8431F] text-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold opacity-90">
                  HOSTILE · 71-100
                </p>
                <h3 className="font-serif font-bold text-2xl mt-1 text-[#FFFFFF]">
                  Do not open. Quarantine.
                </h3>
                <p className="text-xs text-[#F3EAD6]/90 mt-3 leading-relaxed">
                  Multiple critical indicators triggered (executable camouflage, double extension disguised as PDF,
                  or obfuscated script unpackers). Block immediately.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#FFFFFF]/20 text-[10px] font-bold tracking-widest uppercase">
                STATUS: QUARANTINE
              </div>
            </div>
          </div>
        </section>

        {/* CORE FORENSIC CAPABILITIES */}
        <section className="bg-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-3xl p-6 sm:p-10">
          <div className="border-b-2 border-[#26244A] pb-3 mb-6">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#E0A526]">
              CORE ARCHITECTURE
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26244A]">
              Designed for Privacy &amp; Rapid First-Pass Triage
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="space-y-2">
              <div className="size-10 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center font-bold text-base">
                <Lock className="size-5 text-[#26244A]" />
              </div>
              <h3 className="font-bold text-sm text-[#26244A]">Zero Data Exfiltration</h3>
              <p className="text-[#26244A]/80">
                Private documents and sensitive corporate files are analyzed strictly within client browser memory.
                Zero bytes leave your station.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center font-bold text-base">
                <Binary className="size-5 text-[#26244A]" />
              </div>
              <h3 className="font-bold text-sm text-[#26244A]">Triple Cryptographic Digests</h3>
              <p className="text-[#26244A]/80">
                Simultaneously computes hardware-accelerated SHA-256 fingerprints alongside legacy MD5 and SHA-1 hashes
                for historical feed lookups.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center font-bold text-base">
                <Layers className="size-5 text-[#26244A]" />
              </div>
              <h3 className="font-bold text-sm text-[#26244A]">Extension Camouflage Audit</h3>
              <p className="text-[#26244A]/80">
                Flags deceptive double extensions (e.g. <span className="font-bold">invoice.pdf.exe</span>) and malicious
                Unicode RTL (<span className="font-mono">\u202e</span>) spoofing techniques.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center font-bold text-base">
                <Zap className="size-5 text-[#26244A]" />
              </div>
              <h3 className="font-bold text-sm text-[#26244A]">Payload Inspection (256 KB)</h3>
              <p className="text-[#26244A]/80">
                Scans the initial payload stream for obfuscated script primitives (<span className="font-mono">eval</span>, <span className="font-mono">atob</span>)
                and Office macro indicators.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center font-bold text-base">
                <FileText className="size-5 text-[#26244A]" />
              </div>
              <h3 className="font-bold text-sm text-[#26244A]">Exportable Dossier (PDF)</h3>
              <p className="text-[#26244A]/80">
                Produces structured, audit-ready security incident reports containing complete metadata, hashes, and
                handling recommendations with 1 click.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-lg border-2 border-[#26244A] bg-[#E8DCC4] flex items-center justify-center font-bold text-base">
                <Award className="size-5 text-[#26244A]" />
              </div>
              <h3 className="font-bold text-sm text-[#26244A]">Academic &amp; Field Certified</h3>
              <p className="text-[#26244A]/80">
                Developed under the Honeywell Future Skills Edge Program (BharatCares) in partial fulfillment of B.Tech CSE at UVCE.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="bg-[#26244A] text-[#F3EAD6] border-2 border-[#26244A] hard-shadow rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#E0A526] font-bold">
            READY FOR INSPECTION
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFFFFF]">
            Place your first file under glass now.
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DCC4]/80 max-w-xl mx-auto leading-relaxed">
            Instantaneous heuristic scoring, cryptographic fingerprints, and exportable forensic dossiers.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/scan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#E0A526] bg-[#E0A526] text-[#26244A] text-sm font-bold tracking-wider hover:bg-[#F3EAD6] transition-all min-h-[48px] shadow-[4px_4px_0px_#171530]"
            >
              <Microscope className="size-5" />
              <span>Launch Examine Table</span>
              <ArrowRight className="size-4 ml-1" />
            </Link>
            <Link
              to="/observatory"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#E8DCC4] bg-transparent text-[#E8DCC4] text-sm font-bold tracking-wider hover:bg-[#343161] hover:text-[#FFFFFF] transition-all min-h-[48px]"
            >
              <Compass className="size-5" />
              <span>Open Observatory</span>
            </Link>
          </div>
        </section>
      </main>

      {/* STANDALONE LANDING FOOTER */}
      <footer className="mt-12 border-t-2 border-[#26244A] bg-[#F3EAD6] p-6 text-xs text-[#26244A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="font-bold tracking-tight">
              Department of Computer Science &amp; Engineering · UVCE Bengaluru
            </p>
            <p className="text-[11px] opacity-80">
              Honeywell Future Skills Edge · Implemented by BharatCares
            </p>
          </div>
          <div className="space-y-1 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#26244A]/20 w-full sm:w-auto">
            <p className="font-semibold text-[11px]">
              Author: <span className="font-bold">Anjan Poojary (U25UV24T064004)</span>
            </p>
            <p className="text-[11px] opacity-80">
              Proctor: <span className="font-semibold">Dr. Tanuja R, Associate Professor</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
