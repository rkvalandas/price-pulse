import { Metadata } from "next";
import ForgotPassword from "../components/user/ForgotPassword";
export const metadata: Metadata = {
  title: "Forgot Password | Price Pulse",
  description:
    "Reset your Price Pulse account password and regain access to your price alerts.",
  keywords:
    "forgot password, reset password, account recovery, price tracking app",
};
export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
