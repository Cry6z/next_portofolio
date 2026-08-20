"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import { useCMS } from "@/context/CMSContext";

export default function GalleryPage() {
  const { gallery, isPortfolioOpen } = useCMS();

  if (!isPortfolioOpen) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-1 w-full mx-auto max-w-7xl px-6 md:px-12 pt-12 pb-16 min-h-screen">
        <GallerySection gallery={gallery} />
      </main>

      <Footer />
    </>
  );
}
