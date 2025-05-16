import { Suspense } from "react";
import ProductDetails from "../components/product/ProductDetails";

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductLoadingFallback />}>
      <ProductDetails />
    </Suspense>
  );
}

// Loading fallback component
function ProductLoadingFallback() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 mt-4 font-medium">Loading product data...</p>
    </div>
  );
}
