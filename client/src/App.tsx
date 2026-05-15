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
import { AdminGuard } from "./components/auth/admin-guard";
import { AuthGuard } from "./components/auth/auth-guard";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        
        {/* Protected User Routes */}
        <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
        <Route path="/polls" element={<AuthGuard><PollsPage /></AuthGuard>} />
        <Route path="/polls/voted" element={<AuthGuard><VotedPollsPage /></AuthGuard>} />
        <Route path="/polls/create" element={<AuthGuard><CreatePollPage /></AuthGuard>} />
        <Route path="/polls/:id/edit" element={<AuthGuard><CreatePollPage /></AuthGuard>} />
        <Route path="/polls/:id" element={<AuthGuard><PollDetailsPage /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
        
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
      <Toaster />
    </>
  );
}