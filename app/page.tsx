import { Metadata } from "next";
import HomePage from "./components/home/HomePage";

export const metadata: Metadata = {
  title: "Price Pulse - Track Prices, Save Money, Shop Smarter",
  description:
    "Monitor product prices from your favorite online stores. Get notified when prices drop and save money on your purchases.",
  keywords:
    "price tracking, price monitoring, price alerts, price comparison, save money, online shopping, price drop notifications",
};

export default function Home() {
  return <HomePage />;
}
