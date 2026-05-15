import { useEffect } from "react";
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
import PublicPollPage from "./pages/polls/public-poll.tsx";
import PollResultsPage from "./pages/polls/poll-results.tsx";
import VotedPollsPage from "./pages/polls/voted-polls.tsx";
import ExplorePage from "./pages/explore.tsx";
import AuthCallbackPage from "./pages/auth-callback.tsx";
import NotFoundPage from "./pages/not-found.tsx";
import SettingsPage from "./pages/settings.tsx";
import { DashboardLayout } from "./components/dashboard/dashboard-layout";
import { AuthGuard } from "./components/auth/auth-guard";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "./components/error-boundary";

export default function App() {
  useEffect(() => {
    if (!localStorage.getItem("pl_voter_id")) {
      const newVoterId = `voter_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("pl_voter_id", newVoterId);
    }
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        
        {/* Protected User Routes */}
        {/* Protected Admin Routes with Persistent Layout */}
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="/polls/voted" element={<VotedPollsPage />} />
          <Route path="/polls/create" element={<CreatePollPage />} />
          <Route path="/polls/:id/edit" element={<CreatePollPage />} />
          <Route path="/polls/:id" element={<PollDetailsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Public Voting Route */}
        <Route path="/vote/:id" element={<PublicPollPage />} />
        <Route path="/vote/:id/results" element={<PollResultsPage />} />
        
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ErrorBoundary>
      <Toaster />
    </>
  );
}