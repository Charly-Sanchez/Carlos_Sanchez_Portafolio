import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carlos Sánchez - Desarrollador Web Senior",
  description: "Portafolio profesional de Carlos Sánchez, Desarrollador Web Senior con más de 8 años de experiencia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-black`}
        style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        {children}
      </body>
    </html>
  );
}
