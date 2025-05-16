import { Metadata } from "next";
import Signup from "../components/user/Signup";
export const metadata: Metadata = {
  title: "Sign Up | Price Pulse",
  description:
    "Create a new Price Pulse account to track product prices and get alerts when prices drop.",
  keywords: "signup, register, price tracking, price alerts, price monitoring",
};
export default function SignupPage() {
  return <Signup />;
}
