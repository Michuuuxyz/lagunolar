import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laguno Bot - Dashboard",
  description: "Bot Discord multifuncional com sistema de moderação, logs e diversão",
  keywords: ["discord", "bot", "laguno", "moderação", "logs"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#36393f",
                color: "#fff",
                border: "1px solid #5865F2",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
