export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <header className="page-header flex items-center justify-between gap-6">
        <h1>Ivan Manchev</h1>
        <span className="location">Sofia, Bulgaria</span>
      </header>

      <div className="intro">
        <p>I work at the intersection of <span className="soft">technology, marketing</span> and <span className="soft">creativity.</span></p>
        <p>I’m Head of Marketing at <a href="https://www.ambire.com/">Ambire</a>, helping shape how we look, feel and grow.</p>
        <p>Always up for a good conversation about startups, Web3 and what’s next. For speaking, collaboration or a little outside perspective, <a href="mailto:ivan.a.manchev@gmail.com">get in touch</a>.</p>
      </div>

      <footer className="page-footer flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <p>A new home for my work is on its way.</p>
        <p>Elsewhere: <a href="https://x.com/vanzooeth">X</a>, <a href="https://www.instagram.com/dmngdsm/">Instagram</a> &amp; <a href="https://www.linkedin.com/in/ivanmanchev/">LinkedIn</a>.</p>
      </footer>
    </main>
  );
}
