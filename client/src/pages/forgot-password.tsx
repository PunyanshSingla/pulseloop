import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Logo from "@/components/logo"
import { useTheme } from "next-themes"

export default function ForgotPasswordPage() {
  const theme = useTheme()
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {
          theme.resolvedTheme === "dark" ? (
            <img
              src="/forgotpassword-page-darkmode.png"
              alt="Image"
              className="absolute h-full w-full object-cover"
            />
          ) : (
            <img
              src="/forgotpassword-page-lightmode.png"
              alt="Image"
              className="absolute h-full w-full object-cover"
            />
          )
        }
      </div>
    </div>
  )
}
