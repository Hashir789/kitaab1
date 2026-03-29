"use client";

import Navbar from "@/components/primary/navbar/Navbar";
import Footer from "@/components/primary/footer/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname === "/auth";

  return (
    <>
      {!hideChrome && (
        <header>
          <Navbar />
        </header>
      )}
      <main className="container">{children}</main>
      {!hideChrome && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

