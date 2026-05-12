import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing.tsx";
import SignInPage from "./pages/sign-in.tsx";
import SignUpPage from "./pages/sign-up.tsx";
import ForgotPasswordPage from "./pages/forgot-password.tsx";
import ResetPasswordPage from "./pages/reset-password.tsx";
import VerifyEmailPage from "./pages/verify-email.tsx";
import DashboardPage from "./pages/dashboard.tsx";
import PollsPage from "./pages/polls.tsx";
import CreatePollPage from "./pages/polls/create-poll.tsx";
import PollDetailsPage from "./pages/polls/poll-details.tsx";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/polls/create" element={<CreatePollPage />} />
        <Route path="/polls/:id" element={<PollDetailsPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
      <Toaster />
    </>
  );
}