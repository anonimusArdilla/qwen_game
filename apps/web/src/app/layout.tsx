import type { Metadata } from "next"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Wooden Puzzles",
  description: "A modern, calming wooden puzzle experience."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
