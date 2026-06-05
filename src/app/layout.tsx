import type { Metadata } from "next"
import { APP_TITLE } from "@/constants/app"
import { Navbar } from "@/components/Navbar"

export const metadata: Metadata = {
  title: APP_TITLE,
  description: "Yet-to-be-named project for cs464",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
