import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Logo from "@/components/logo"

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error")
        setMessage("Invalid or missing verification token.")
        return
      }

      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token,
          },
        })

        if (error) {
          setStatus("error")
          setMessage(error.message || "Email verification failed.")
        } else {
          setStatus("success")
          setMessage("Your email has been successfully verified! You can now sign in to your account.")
        }
      } catch (err) {
        setStatus("error")
        setMessage("An unexpected error occurred.")
      }
    }

    verify()
  }, [token])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <h1 className="text-2xl font-bold tracking-tight">Email Verification</h1>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Verifying...</h2>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we verify your email address.
                  </p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Success!</h2>
                  <p className="text-sm text-muted-foreground">
                    {message}
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/sign-in">Sign In</Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Verification Failed</h2>
                  <p className="text-sm text-muted-foreground">
                    {message}
                  </p>
                </div>
                <div className="grid w-full gap-2">
                  <Button asChild variant="outline">
                    <Link to="/sign-up">Back to Sign Up</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/sign-in">Already verified? Sign In</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
