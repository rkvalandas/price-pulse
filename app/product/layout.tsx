import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | Price Pulse",
  description:
    "View product details and set price alerts for products you want to track",
  keywords: "product details, price tracking, price alerts, price comparison",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
