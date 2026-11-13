import type { Metadata } from "next";
import { PortfolioShell } from "../../components/portfolio-shell";

const title = "You Can't Automate Judgment: Taste as the Missing Skill in Web3 | Talk at ETH Prague 2026";
const description = "AI has collapsed execution. Anyone can ship, fork, or generate fast. What hasn’t scaled is judgment. That gap is where taste lives. This talk reframes taste as a practical skill, not a vague aesthetic trait: the ability to recognize what fits, what’s excessive, and what actually matters. I gave this talk at ETH Prague 2026.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ethprague/" },
  openGraph: {
    title,
    description,
    url: "/ethprague/",
    type: "website",
    locale: "en_US",
  },
};

export default function EthPrague() {
  return (
    <PortfolioShell>
      <article className="intro talk" aria-labelledby="talk-title">
        <h1 id="talk-title" className="talk-title">{title}</h1>
        <p className="talk-description">{description}</p>
        <iframe
          className="talk-video"
          src="https://www.youtube-nocookie.com/embed/grYKii6Uhuk"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <p className="talk-video-link"><a href="https://www.youtube.com/watch?v=grYKii6Uhuk">Watch on YouTube</a></p>
      </article>
    </PortfolioShell>
  );
}
