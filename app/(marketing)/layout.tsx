import { Suspense } from "react";
import Navbar from "@/app/components/home/Navbar";
import Footer from "@/app/components/home/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}
