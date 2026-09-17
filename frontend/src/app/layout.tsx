import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { PlayerProvider } from "@/context/PlayerContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const serifAccent = Instrument_Serif({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "Nuzio AI — News on go",
  description: "Your personalised audio brief, every morning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${serifAccent.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg">
        <AppProviders>
          <PlayerProvider>
            <div className="app-shell">{children}</div>
          </PlayerProvider>
        </AppProviders>
      </body>
    </html>
  );
}
