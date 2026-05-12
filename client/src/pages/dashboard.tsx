import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  Bell,
  Calendar,
  ChevronRight,
  Clock3,
  LineChart,
  Plus,
  Sparkles,
  Users,
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f5f6f8]">
        <div className="mx-auto max-w-7xl p-6 md:p-10">
          <div className="h-12 w-48 animate-pulse rounded-2xl bg-white/80" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/80" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f6f8] px-6 text-center">
        <h1 className="text-2xl font-semibold text-[#111317]">Not authenticated</h1>
        <p className="max-w-sm text-sm text-[#5e6470]">
          Please sign in to access your workspace dashboard.
        </p>
        <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
      </div>
    )
  }

  const statCards = [
    { label: "Active Polls", value: "12", change: "+8.2%", icon: LineChart },
    { label: "Responses", value: "4,298", change: "+12.4%", icon: Users },
    { label: "Avg. Completion", value: "86%", change: "+3.1%", icon: Sparkles },
    { label: "Scheduled", value: "7", change: "+1.5%", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e8f0ff_0%,_#f5f6f8_40%,_#f7f7f8_100%)] text-[#111317]">
      <div className="mx-auto max-w-7xl p-5 md:p-8">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-[0_10px_40px_rgba(17,19,23,0.06)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-[#5e6470]">Good to see you back</p>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {session.user.name}&apos;s Dashboard
                </h1>
                <p className="mt-1 text-sm text-[#5e6470]">{session.user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl border-[#d9dde5] bg-white">
                  <Bell className="mr-2 h-4 w-4" />
                  Alerts
                </Button>
                <Button className="rounded-xl bg-[#111317] text-white hover:bg-[#1e222b]">
                  <Plus className="mr-2 h-4 w-4" />
                  New Poll
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map(({ label, value, change, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#e7e9ee] bg-white p-4 shadow-[0_6px_20px_rgba(17,19,23,0.04)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-[#5e6470]">{label}</p>
                    <Icon className="h-4 w-4 text-[#6d7482]" />
                  </div>
                  <p className="text-2xl font-semibold tracking-tight">{value}</p>
                  <p className="mt-2 text-xs text-emerald-600">{change} this week</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#e7e9ee] bg-white p-5 lg:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-base font-semibold">Response Trend</h2>
                  <button className="text-sm text-[#5e6470] hover:text-[#111317]">Last 30 days</button>
                </div>
                <div className="h-52 rounded-xl bg-[linear-gradient(180deg,_#ffffff_0%,_#f3f7ff_100%)] p-4">
                  <div className="flex h-full items-end gap-2">
                    {[32, 46, 41, 55, 66, 58, 72, 68, 84, 77, 90, 96].map((h, i) => (
                      <div
                        key={i}
                        className="w-full rounded-md bg-[linear-gradient(180deg,_#cbdcff_0%,_#5b7ee5_100%)]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e7e9ee] bg-white p-5">
                <h2 className="mb-4 text-base font-semibold">Upcoming</h2>
                <div className="space-y-3">
                  {[
                    "Team Pulse Check",
                    "Quarterly Sentiment Survey",
                    "Onboarding Feedback Loop",
                  ].map((item, i) => (
                    <div key={item} className="rounded-xl border border-[#eceef3] p-3">
                      <p className="text-sm font-medium">{item}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-[#5e6470]">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {i + 1} day{i === 0 ? "" : "s"} left
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#e7e9ee] bg-white p-5">
                <h2 className="mb-4 text-base font-semibold">Recent Activity</h2>
                <div className="space-y-4 text-sm">
                  {[
                    "New poll created: Employee NPS",
                    "84 responses received in Product Retrospective",
                    "Weekly Mood Pulse closed successfully",
                  ].map((entry) => (
                    <div key={entry} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#4f77e8]" />
                      <p className="text-[#22252d]">{entry}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#e7e9ee] bg-white p-5">
                <h2 className="mb-4 text-base font-semibold">Quick Actions</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Create Poll", "View Reports", "Export Data", "Manage Team"].map((action) => (
                    <button
                      key={action}
                      className="flex items-center justify-between rounded-xl border border-[#e8ebf2] bg-[#fafbff] px-4 py-3 text-sm font-medium hover:border-[#d2dbf2] hover:bg-[#f1f5ff]"
                    >
                      {action}
                      <ArrowUpRight className="h-4 w-4 text-[#6a7280]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-xl border-[#d9dde5] bg-white"
                onClick={async () => {
                  await authClient.signOut()
                  navigate("/sign-in")
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
