import Logo from "@/components/logo"
import { SignupForm } from "@/components/signup-form"
import { useTheme } from "next-themes"

export default function SignupPage() {
  const theme = useTheme()
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-2 p-4 md:p-8">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {
          theme.theme == "light" ? (
            <img
              src="/signup-page-lightmode.png"
              alt="Image"
              className="absolute h-full w-full object-cover"
            />
          ) : (
            <img
              src="/signup-page-darkmode.png"
              alt="Image"
              className="absolute h-full w-full object-cover"
            />
          )
        }
      </div>
    </div>
  )
}
