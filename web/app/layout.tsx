import "./globals.css";

export const metadata = {
  title: "Job Search Copilot",
  description: "Track applications and analyze job posting fit with an AI agent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
