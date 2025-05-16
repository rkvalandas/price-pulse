import { Metadata } from "next";
import Login from "../components/user/Login";
export const metadata: Metadata = {
  title: "Login | Price Pulse",
  description:
    "Sign in to your Price Pulse account to track prices and manage your price alerts.",
  keywords: "login, sign in, price tracking, price alerts",
};
export default function LoginPage() {
  return <Login />;
}
