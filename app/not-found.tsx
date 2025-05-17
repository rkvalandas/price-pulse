"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandedBackground from "./components/ui/BrandedBackground";

// This component will automatically redirect to home page
// when a 404 page is encountered
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to home page after component mounts
    router.replace("/");
  }, [router]);

  // This UI will be shown briefly before redirect happens
  return (
    <BrandedBackground>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6">
        <div className="animate-pulse">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            Redirecting you home...
          </h2>
        </div>
      </div>
    </BrandedBackground>
  );
}
