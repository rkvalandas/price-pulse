"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandedBackground from "./components/ui/BrandedBackground";

// This error component redirects to the home page in case of any error
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to console for debugging
    console.error("Application error:", error);

    // Redirect to home page after component mounts
    const redirectTimer = setTimeout(() => {
      router.replace("/");
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [error, router]);

  return (
    <BrandedBackground>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6">
        <div className="animate-pulse">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            Something went wrong
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md">
            Redirecting you to the home page...
          </p>
        </div>
      </div>
    </BrandedBackground>
  );
}
