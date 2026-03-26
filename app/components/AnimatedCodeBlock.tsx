"use client";

import { useEffect, useState } from "react";

const properties = [
  { key: "skills", values: ["growing", "in progress", "leveling up"] },
  { key: "confidence", values: ["rising", "sky-high", "unstoppable"] },
  { key: "ready", values: ["true"] },
  { key: "focus", values: ["deep", "locked in"] },
  { key: "grit", values: ["relentless", "unbreakable"] },
  { key: "status", values: ["hired", "crushing it"] },
];

interface Line {
  key: string;
  value: string;
  isBoolean: boolean;
}

function pickLines(): Line[] {
  // Always include skills, confidence, ready + 1 random extra
  const base = properties.slice(0, 3);
  const extras = properties.slice(3);
  const extra = extras[Math.floor(Math.random() * extras.length)];
  const extra2 = extras[Math.floor(Math.random() * extras.length)];
  const selected = [...base, extra];

  return selected.map((p) => ({
    key: p.key,
    value: p.values[Math.floor(Math.random() * p.values.length)],
    isBoolean: p.key === "ready",
  }));
}

export default function AnimatedCodeBlock() {
  const [lines, setLines] = useState<Line[]>([
    { key: "skills", value: "growing", isBoolean: false },
    { key: "confidence", value: "rising", isBoolean: false },
    { key: "ready", value: "true", isBoolean: true },
  ]);
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [typingLine, setTypingLine] = useState<number>(-1);
  const [typedChars, setTypedChars] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "clearing">("typing");

  // Initial reveal: type lines one by one
  useEffect(() => {
    if (phase !== "typing") return;

    if (typingLine === -1) {
      // Start typing first line
      const t = setTimeout(() => {
        setTypingLine(0);
        setTypedChars(0);
      }, 400);
      return () => clearTimeout(t);
    }

    if (typingLine >= lines.length) {
      // All lines typed, pause then cycle
      setPhase("pausing");
      return;
    }

    const currentLine = lines[typingLine];
    const fullText = `  ${currentLine.key}: ${currentLine.isBoolean ? currentLine.value : `"${currentLine.value}"`},`;

    if (typedChars < fullText.length) {
      const speed = 30 + Math.random() * 40;
      const t = setTimeout(() => setTypedChars((c) => c + 1), speed);
      return () => clearTimeout(t);
    }

    // Line done, move to next
    const t = setTimeout(() => {
      setDisplayedLines(typingLine + 1);
      setTypingLine(typingLine + 1);
      setTypedChars(0);
    }, 150);
    return () => clearTimeout(t);
  }, [phase, typingLine, typedChars, lines]);

  // Pause then regenerate
  useEffect(() => {
    if (phase !== "pausing") return;

    const t = setTimeout(() => setPhase("clearing"), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // Clear and regenerate
  useEffect(() => {
    if (phase !== "clearing") return;

    const t = setTimeout(() => {
      const newLines = pickLines();
      setLines(newLines);
      setDisplayedLines(0);
      setTypingLine(-1);
      setTypedChars(0);
      setPhase("typing");
    }, 400);
    return () => clearTimeout(t);
  }, [phase]);

  function renderLine(line: Line, index: number) {
    const fullText = `  ${line.key}: ${line.isBoolean ? line.value : `"${line.value}"`},`;

    // Already fully typed
    if (index < displayedLines) {
      return (
        <p key={`${line.key}-${index}`} className="pl-4 whitespace-pre">
          <span className="text-slate-300">{line.key}</span>
          <span className="text-slate-400">: </span>
          {line.isBoolean ? (
            <span className="text-orange-400">{line.value}</span>
          ) : (
            <span className="text-green-400">&quot;{line.value}&quot;</span>
          )}
          <span className="text-slate-400">,</span>
        </p>
      );
    }

    // Currently typing this line
    if (index === typingLine) {
      const visible = fullText.slice(0, typedChars);
      return (
        <p key={`typing-${index}`} className="pl-4 whitespace-pre">
          <span className="text-slate-300">{visible}</span>
          <span className="animate-blink text-blue-400">▎</span>
        </p>
      );
    }

    return null;
  }

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#0e1d33] p-8 sm:p-12 w-full">
      <div className="font-mono text-sm leading-relaxed text-slate-400">
        <p>
          <span className="text-blue-400">const</span>{" "}
          <span className="text-white">developer</span>{" "}
          <span className="text-slate-400">= </span>
          <span className="text-blue-400">{"{"}</span>
        </p>

        {lines.map((line, i) => renderLine(line, i))}

        {phase === "clearing" && (
          <p className="pl-4">
            <span className="animate-blink text-blue-400">▎</span>
          </p>
        )}

        <p className={phase === "clearing" ? "opacity-50 transition-opacity" : ""}>
          <span className="text-blue-400">{"}"}</span>
          <span className="text-slate-400">;</span>
        </p>
      </div>
    </div>
  );
}
