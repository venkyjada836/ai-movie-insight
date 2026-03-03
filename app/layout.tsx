import "./globals.css";

export const metadata = {
  title: "AI Movie Insight Builder",
  description: "IMDb Movie Insight Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}