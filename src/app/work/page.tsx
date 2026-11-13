import type { Metadata } from "next";
import { PortfolioShell } from "../../components/portfolio-shell";

export const metadata: Metadata = {
  title: "Work — Ivan Manchev",
  description: "Selected projects in marketing, technology and creative direction by Ivan Manchev.",
  alternates: { canonical: "/work/" },
  openGraph: {
    title: "Work — Ivan Manchev",
    description: "Selected projects in marketing, technology and creative direction by Ivan Manchev.",
    url: "/work/",
    type: "website",
    locale: "en_US",
  },
};

export default function Work() {
  return (
    <PortfolioShell variant="work" paint="koi">
      <nav className="intro" aria-label="Selected projects">
        <h1 className="sr-only">Work</h1>
        <p><a href="/ambire-ice/">Ambire Ice</a></p>
        <p><a href="/ethprague/">You Can't Automate Judgement (Talk)</a></p>
      </nav>
    </PortfolioShell>
  );
}
