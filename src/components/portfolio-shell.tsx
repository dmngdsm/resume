import type { ReactNode } from "react";
import { CursorPaint } from "./ui/cursor-paint";
import { PaintText } from "./ui/paint-text";
import { ScrambleHeading } from "./ui/scramble-heading";

export function PortfolioShell({ children, paint, variant = "project" }: { children: ReactNode; paint?: "interactive" | "koi"; variant?: "index" | "work" | "project" }) {
  const project = variant === "project";

  return (
    <main className={`flex min-h-svh flex-col${project ? " project-page" : ""}`}>
      {paint && <CursorPaint pointerPainting={paint === "interactive"} />}
      <PaintText>
        <header className={`page-header flex items-center justify-between gap-6${project ? " project-header" : ""}`}>
          {variant === "index" ? <ScrambleHeading /> : (
            <a className="home-link" href={project ? "/work/" : "/"} aria-label={project ? "Ivan Manchev / work — return to work" : "Ivan Manchev — return to homepage"}>
              <span className="back-arrow" aria-hidden="true">←</span><span>{project ? "Ivan Manchev / work" : "Ivan Manchev"}</span>
            </a>
          )}
          <span className="location">Sofia, Bulgaria</span>
        </header>

        {children}

        <footer className="page-footer flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <p>This page lives on my <a href="https://github.com/dmngdsm">Github</a></p>
          <p>Elsewhere: <a href="https://x.com/vanzooeth">X</a>, <a href="https://www.instagram.com/dmngdsm/">Instagram</a> &amp; <a href="https://www.linkedin.com/in/ivanmanchev/">LinkedIn</a>.</p>
        </footer>
      </PaintText>
    </main>
  );
}
