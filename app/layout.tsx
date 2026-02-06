import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { getPortfolioContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { personal } = await getPortfolioContent();
  return {
    title: `${personal.name} - ${personal.tagline}`,
    description: personal.bio,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
