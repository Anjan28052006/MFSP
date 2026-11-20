import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, CircleDot, TableProperties, BookOpen, Compass } from "lucide-react";

const NAV = [
  { to: "/scan", label: "Examine Table", icon: CircleDot },
  { to: "/history", label: "Specimen Ledger", icon: TableProperties },
  { to: "/tips", label: "Field Notes", icon: BookOpen },
  { to: "/", label: "Observatory", icon: Compass },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#E8DCC4] text-[#26244A] font-mono">
      {/* Fixed 230px Indigo Sidebar for >= 800px (md) */}
      <aside className="hidden md:flex w-[230px] flex-shrink-0 flex-col bg-[#26244A] text-[#F3EAD6] p-5 border-r-2 border-[#26244A] sticky top-0 h-screen justify-between z-30">
        <div>
          {/* Logo */}
          <Link to="/" className="block group mb-8">
            <h1 className="font-serif font-black text-3xl tracking-tight text-[#F3EAD6]">
              MFSP
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-[#E0A526] uppercase font-bold mt-0.5">
              Threat Observatory
            </p>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-semibold tracking-wider transition-all min-h-[44px] ${
                    active
                      ? "bg-[#E0A526] text-[#26244A] shadow-[3px_3px_0px_#171530]"
                      : "text-[#E8DCC4] hover:bg-[#343161] hover:text-[#FFFFFF]"
                  }`}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#3B3868] text-[11px] leading-relaxed text-[#E8DCC4]/80">
          <p className="font-semibold text-[#E8DCC4]">Nothing leaves this room.</p>
          <p className="mt-1 text-[10px] opacity-75">
            Every specimen is examined in your browser.
          </p>
        </div>
      </aside>

      {/* Mobile Top Bar for < 800px */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#26244A] text-[#F3EAD6] border-b-2 border-[#26244A] sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif font-black text-xl text-[#F3EAD6]">MFSP</span>
          <span className="text-[10px] tracking-widest text-[#E0A526] uppercase font-bold">
            / Observatory
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F3EAD6] rounded border border-[#3B3868]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#26244A] text-[#F3EAD6] border-b-2 border-[#26244A] p-4 flex flex-col gap-2 z-40 sticky top-[57px]">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold tracking-wider min-h-[44px] ${
                  active ? "bg-[#E0A526] text-[#26244A]" : "text-[#E8DCC4] hover:bg-[#343161]"
                }`}
              >
                <Icon className="size-4" />
                <span>{n.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#3B3868] text-[10px] text-[#E8DCC4]/70">
            Nothing leaves this room. Every specimen is examined in your browser.
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>

        {/* Universal Footer Required on EVERY PAGE */}
        <footer className="mt-auto border-t-2 border-[#26244A] bg-[#F3EAD6] p-5 text-xs text-[#26244A]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
    </div>
  );
}
