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
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { appUrl } from "@/lib/auth-redirect"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await authClient.signIn.email({
      email,
      password,
    })
    
    if (error) {
      setLoading(false)
      toast.error(error.message || "An error occurred during sign in")
      return
    }

    setLoading(false)
    toast.success("Signed in successfully")
    navigate(callbackUrl)
  }

  const handleSocialSignIn = async (provider: "google") => {
      setLoading(true)
      await authClient.signIn.social({
          provider,
          callbackURL: appUrl(`/auth-callback?callbackUrl=${encodeURIComponent(callbackUrl)}`),
          errorCallbackURL: appUrl("/sign-in"),
      })
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSignIn}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field className="flex justify-center">
          <Button variant="outline" type="button" onClick={() => handleSocialSignIn("google")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.136 2.56-6.392 2.56-5.092 0-9.248-4.128-9.248-9.248s4.156-9.248 9.248-9.248c2.768 0 4.856 1.08 6.328 2.472l2.304-2.304C18.576 1.056 15.864 0 12.48 0 5.864 0 0 5.864 0 12.48s5.864 12.48 12.48 12.48c3.648 0 6.392-1.2 8.648-3.528 2.256-2.256 2.968-5.416 2.968-8.112 0-.8-.064-1.552-.184-2.256h-11.44z" fill="currentColor"/>
            </svg>
            Google
          </Button>

        </Field>
        <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
      </FieldGroup>
    </form>
  )
}
