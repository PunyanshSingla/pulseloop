import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { appUrl } from "@/lib/auth-redirect"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: appUrl("/reset-password"),
    })
    setLoading(false)
    if (error) {
      toast.error(error.message || "An error occurred")
    } else {
      setSuccess(true)
      toast.success("Password reset link sent to your email!")
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-sm text-balance text-muted-foreground">
              We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
              Please check your inbox to continue.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/sign-in">Back to Sign In</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setSuccess(false)}
              className="underline underline-offset-4 hover:text-primary"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link to="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
