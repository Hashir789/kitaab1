"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/primary/navbar/Navbar";
import Footer from "@/components/primary/footer/Footer";
import SessionTracker from "@/components/primary/sessiontracker/SessionTracker";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname === "/auth" || pathname.startsWith("/user");

  return (
    <>
      <SessionTracker />
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

