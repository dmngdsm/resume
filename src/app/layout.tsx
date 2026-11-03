import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ivanmanchev.com"),
  title: "Ivan Manchev — Marketing, technology & creative direction",
  description: "Head of Marketing and management board member at Ambire. Working across marketing, technology and creative direction. Based in Sofia, Bulgaria.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ivan Manchev",
    description: "Marketing, technology & creative direction. Head of Marketing at Ambire.",
    url: "https://www.ivanmanchev.com",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
