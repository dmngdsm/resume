import { PortfolioShell } from "../components/portfolio-shell";

export default function Home() {
  return (
    <PortfolioShell variant="index" paint="interactive">
      <div className="intro">
        <p>I work at the intersection of <span className="soft">technology, marketing</span> and <span className="soft">creativity.</span></p>
        <p>I’m Head of Marketing at <a href="https://www.ambire.com/">Ambire</a>, helping shape how we look, feel and grow.</p>
        <p>Always up for a good conversation about startups, Web3 and what’s next. For speaking, collaboration or a little outside perspective, <a href="mailto:ivan.a.manchev@gmail.com">get in touch</a> or check <a href="/work/">things I've done</a>.</p>
      </div>
    </PortfolioShell>
  );
}
