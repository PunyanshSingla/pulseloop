import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/sign-in.tsx";
import SignUpPage from "./pages/sign-up.tsx";
import ForgotPasswordPage from "./pages/forgot-password.tsx";
import ResetPasswordPage from "./pages/reset-password.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}