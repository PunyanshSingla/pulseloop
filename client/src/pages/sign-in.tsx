import { useState } from "react"
import { LoginForm } from "@/components/signin-form"
import Logo from "@/components/logo"
import { useTheme } from "next-themes"
import { authClient } from "@/lib/auth-client"
import { Navigate, useSearchParams } from "react-router-dom"

export default function SignInPage() {
  const theme = useTheme()
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const [searchParams] = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  // Mark initial check as done once we've had a successful or failed load
  if (!isPending && !hasCheckedSession) {
    setHasCheckedSession(true)
  }

  // Only show the spinner during the VERY FIRST load
  if (!hasCheckedSession && isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 dark:bg-slate-950">
         <div className="size-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (session && hasCheckedSession) {
    return <Navigate to={callbackUrl} replace />
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo/>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {
          theme.resolvedTheme === "dark" ? (
            <img
            src="/signin-page-darkmode.png"
            alt="Image"
            className="absolute h-full w-full object-cover"
          />
          ) : (
            <img
            src="/signin-page-lightmode.png"
            alt="Image"
            className="absolute h-full w-full object-cover"
          />
          )
        }
        
      </div>
    </div>
  )
}
