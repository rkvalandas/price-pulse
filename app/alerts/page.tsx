import { Metadata } from "next";
import UserAlerts from "../components/alerts/UserAlerts";
export const metadata: Metadata = {
  title: "Your Alerts | Price Pulse",
  description:
    "Manage and view your price alerts. Get notified when prices drop below your target.",
  keywords:
    "price alerts, price tracking, price monitoring, price drop notification",
};
export default function AlertsPage() {
  return <UserAlerts />;
}
