import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Check if session exists AND if user is admin
  // Note: We cast user to any because the base User type in better-auth 
  // might not know about our custom 'role' field yet in TypeScript.
  const user = session?.user as any;
  const isAdmin = user?.role === "admin";

  if (!session || !isAdmin) {
    console.warn("🚫 Access Denied: Admin role required.");
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};
