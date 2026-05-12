import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { appUrl } from "@/lib/auth-redirect"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: appUrl("/sign-in"),
      errorCallbackURL: appUrl("/sign-up"),
    })
    setLoading(false)
    if (error) {
      toast.error(error.message || "An error occurred during sign up")
    } else {
      setSuccess(true)
      toast.success("Sign up successful! Please check your email for verification.")
    }
  }

  const handleSocialSignUp = async (provider: "google") => {
      setLoading(true)
      const { error } = await authClient.signIn.social({
          provider,
          callbackURL: appUrl("/dashboard"),
          errorCallbackURL: appUrl("/sign-up"),
      })
      setLoading(false)
      if (error) {
          toast.error(error.message || `An error occurred during ${provider} sign up`)
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
              We&apos;ve sent a verification link to <span className="font-medium text-foreground">{email}</span>.
              Please check your inbox and click the link to verify your account.
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
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSignUp}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
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
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input 
            id="confirm-password" 
            type="password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field className="flex justify-center">
          <Button variant="outline" type="button" onClick={() => handleSocialSignUp("google")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.136 2.56-6.392 2.56-5.092 0-9.248-4.128-9.248-9.248s4.156-9.248 9.248-9.248c2.768 0 4.856 1.08 6.328 2.472l2.304-2.304C18.576 1.056 15.864 0 12.48 0 5.864 0 0 5.864 0 12.48s5.864 12.48 12.48 12.48c3.648 0 6.392-1.2 8.648-3.528 2.256-2.256 2.968-5.416 2.968-8.112 0-.8-.064-1.552-.184-2.256h-11.44z" fill="currentColor"/>
            </svg>
            Google
          </Button>
        </Field>
        <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/sign-in" className="underline underline-offset-4">Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
