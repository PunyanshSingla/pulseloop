import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession()
    const navigate = useNavigate()

    if (isPending) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-2xl font-bold">Not authenticated</h1>
                <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
            <p className="text-muted-foreground">{session.user.email}</p>
            <Button variant="outline" onClick={async () => {
                await authClient.signOut()
                navigate("/sign-in")
            }}>Sign Out</Button>
        </div>
    )
}
