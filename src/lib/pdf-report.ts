import { jsPDF } from "jspdf";
import type { ScanReport } from "./scanner";
import { formatBytes } from "./scanner";

const LEVEL_COLOR: Record<ScanReport["level"], [number, number, number]> = {
  safe: [47, 125, 107], // moss #2F7D6B
  suspicious: [224, 165, 38], // ochre #E0A526
  dangerous: [184, 67, 31], // vermilion #B8431F
};

const VERDICT_WORD: Record<ScanReport["level"], string> = {
  safe: "BENIGN",
  suspicious: "CURIOUS",
  dangerous: "HOSTILE",
};

export function downloadReport(report: ScanReport) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 56;

  // Header band in Deep Indigo Ink #26244A
  doc.setFillColor(38, 36, 74);
  doc.rect(0, 0, pageW, 80, "F");
  doc.setTextColor(243, 234, 214); // Cream #F3EAD6
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("MFSP / THREAT OBSERVATORY", 40, 38);
  doc.setFontSize(10);
  doc.setTextColor(224, 165, 38); // Ochre #E0A526
  doc.text("FORENSIC SPECIMEN DOSSIER · FIELD EXAMINATION REPORT", 40, 58);

  y = 110;
  doc.setTextColor(38, 36, 74);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Specimen Identification", 40, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const rows: [string, string][] = [
    ["File name", report.fileName],
    ["File size", formatBytes(report.fileSize)],
    ["File type", report.fileType],
    ["Examined at", new Date(report.scannedAt).toLocaleString()],
    ["MD5 Digest", report.md5],
    ["SHA-1 Digest", report.sha1],
    ["Fingerprint (SHA-256)", report.sha256],
  ];
  for (const [k, v] of rows) {
    doc.setFont("helvetica", "bold");
    doc.text(k, 40, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(v, pageW - 180);
    doc.text(lines, 160, y);
    y += 14 * Math.max(1, lines.length);
  }

  y += 14;
  const [r, g, b] = LEVEL_COLOR[report.level];
  doc.setFillColor(r, g, b);
  doc.roundedRect(40, y, 190, 36, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const verdict = VERDICT_WORD[report.level];
  doc.text(`VERDICT: ${verdict} (${report.score}/100)`, 48, y + 23);
  y += 62;

  // Threat Findings
  doc.setTextColor(38, 36, 74);
  doc.setFontSize(14);
  doc.text(`Triggered Heuristic Indicators (${report.findings.length})`, 40, y);
  y += 18;
  doc.setFontSize(10);
  for (const f of report.findings) {
    if (y > 760) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold");
    doc.text(`[+${f.weight}] ${f.title}`, 40, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(f.detail, pageW - 80);
    doc.text(lines, 40, y);
    y += 14 * lines.length + 6;
  }

  // Recommendations / Protocol
  if (y > 720) { doc.addPage(); y = 60; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Laboratory Handling Protocol", 40, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const rec of report.recommendations) {
    if (y > 780) { doc.addPage(); y = 60; }
    const lines = doc.splitTextToSize(`- ${rec}`, pageW - 80);
    doc.text(lines, 40, y);
    y += 14 * lines.length;
  }

  // University / Internship Footer inside Dossier PDF
  y += 24;
  if (y > 760) { doc.addPage(); y = 60; }
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Department of Computer Science & Engineering · UVCE Bengaluru", 40, y);
  y += 11;
  doc.text("Honeywell Future Skills Edge · Implemented by BharatCares | Author: Anjan Poojary (U25UV24T064004)", 40, y);

  doc.save(`dossier-${report.fileName}.pdf`);
}
