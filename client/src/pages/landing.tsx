import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  GitBranch,
  Lock,
  Plus,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const { data: session } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden items-center gap-6 md:flex">
            <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="#product">Product</a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="#how">How it works</a>
            <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" to="/explore">Explore</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!session ? (
            <>
              <Link
                to="/sign-in"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
              >
                Sign in
              </Link>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Link
                to="/sign-up"
                className="hidden items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/30 transition-all hover:brightness-110 sm:inline-flex"
              >
                Get started
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          ) : (
            <>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/30 transition-all hover:brightness-110 sm:inline-flex"
              >
                Dashboard
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background md:hidden"
          >
            <div className="space-y-1 px-4 py-6">
              <a
                href="#product"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Product
              </a>
              <a
                href="#how"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                How it works
              </a>
              <Link
                to="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Explore
              </Link>
              <div className="pt-4 border-t border-border mt-4 flex flex-col gap-3">
                {!session ? (
                  <>
                    <Link
                      to="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg px-4 py-3 text-base font-medium text-foreground ring-1 ring-border"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm"
                    >
                      Get started
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Poll Mockup ───────────────────────────────────────────────────────────────
function PollMockup() {
  const options = [
    { label: "Real-time Analytics Dashboard", pct: 42, active: true },
    { label: "Advanced Privacy Controls", pct: 28, active: false },
    { label: "API & Webhooks Integration", pct: 30, active: false },
  ];
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-card p-8 shadow-2xl ring-1 ring-black/5 md:p-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
            Live Poll
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            pulseloop.io/p/q3-roadmap
          </span>
        </div>
        <h2 className="mb-6 max-w-[40ch] text-balance text-xl font-medium">
          Which feature should we prioritize for the Q3 roadmap?
        </h2>
        <div className="space-y-4">
          {options.map((o, i) => (
            <div key={o.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-sm font-medium ${o.active ? "" : "text-muted-foreground"}`}>
                  {o.label}
                </span>
                <span className={`text-sm ${o.active ? "text-foreground" : "text-muted-foreground"}`}>
                  {o.pct}%
                </span>
              </div>
              <div className={`relative h-10 w-full overflow-hidden rounded-lg border ${o.active ? "border-border bg-muted" : "border-border/60 bg-muted/60"}`}>
                <div
                  className={`h-full transition-all duration-700 ${o.active ? "border-r border-primary bg-primary/20" : "bg-muted-foreground/15"}`}
                  style={{ width: `${o.pct}%`, transitionDelay: `${i * 120}ms` }}
                />
                {o.active && (
                  <div className="absolute inset-0 flex items-center px-4">
                    <div className="mr-3 grid size-4 place-items-center rounded-full border-2 border-primary bg-card">
                      <Check className="size-2 text-primary" strokeWidth={4} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-6">
        <div className="flex -space-x-2">
          <div className="size-6 rounded-full border-2 border-card bg-zinc-200" />
          <div className="size-6 rounded-full border-2 border-card bg-zinc-300" />
          <div className="size-6 rounded-full border-2 border-card bg-zinc-400" />
        </div>
        <span className="text-xs text-muted-foreground">842 responses collected</span>
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const { data: session } = authClient.useSession();

  return (
    <section className="px-6 pt-24 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            <span>Now in public beta</span>
          </div>
          <h1 className="mx-auto mb-6 max-w-[24ch] text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Capture the heartbeat of your audience
          </h1>
          <p className="mx-auto mb-10 max-w-[56ch] text-pretty text-base text-muted-foreground sm:text-lg">
            Create friction-less polls that people actually enjoy answering.
            Share via link, collect rich data, and make informed decisions faster.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {!session ? (
              <Link
                to="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary/30 transition-all hover:brightness-110 sm:w-auto"
              >
                <Plus className="size-4" />
                Create your first poll
              </Link>
            ) : (
              <Link
                to="/polls/create"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary/30 transition-all hover:brightness-110 sm:w-auto"
              >
                <Plus className="size-4" />
                Create new poll
              </Link>
            )}
            <Link
              to="/explore"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-black/5 transition-all hover:ring-black/10 sm:w-auto"
            >
              Explore public polls
            </Link>
          </div>
        </div>
        <PollMockup />
      </div>
    </section>
  );
}

// ─── Share Strip ───────────────────────────────────────────────────────────────
function ShareStrip() {
  return (
    <div className="bg-zinc-900 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Shareable Link System
        </span>
        <div className="flex items-center gap-3 rounded-md bg-zinc-800 px-3 py-1.5 ring-1 ring-white/10">
          <code className="text-sm text-emerald-400">pulseloop.io/s/6k2p9</code>
          <button className="text-zinc-500 transition-colors hover:text-white" aria-label="Copy link">
            <Copy className="size-4" />
          </button>
        </div>
        <div className="hidden h-4 w-px bg-zinc-700 sm:block" />
        <span className="text-sm text-zinc-400">
          Instant delivery across Slack, Teams, and Email
        </span>
      </div>
    </div>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "1", title: "Compose", desc: "Craft questions using our intuitive block editor. Add logic jumps and media effortlessly." },
    { n: "2", title: "Distribute", desc: "Generate a unique link or embed the poll directly into your product or website." },
    { n: "3", title: "Analyze", desc: "Watch responses roll in with real-time visualization and exportable CSV data." },
  ];
  return (
    <section id="how" className="bg-card px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight">
          Three steps to clarity
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="space-y-4">
              <div className="grid size-10 place-items-center rounded-lg bg-accent font-semibold text-accent-foreground">
                {s.n}
              </div>
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="max-w-[35ch] text-pretty text-sm text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: ShieldCheck, title: "Secure Identity", desc: "Optionally restrict polls to specific domains or require verified email logins." },
    { icon: GitBranch, title: "Logic Jumps", desc: "Create personalized paths for respondents based on their previous answers." },
    { icon: Zap, title: "Instant Results", desc: "Dynamic charts update the moment a submission is received. Zero delay." },
  ];
  return (
    <section id="features" className="bg-secondary px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex h-full flex-col rounded-xl bg-card p-8 ring-1 ring-black/5">
              <div className="mb-6 grid size-9 place-items-center rounded bg-muted">
                <Icon className="size-4 text-foreground" />
              </div>
              <h4 className="mb-2 font-medium">{title}</h4>
              <p className="max-w-[35ch] text-pretty text-sm text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Mock ────────────────────────────────────────────────────────────
function DashboardMock() {
  const bars = [60, 35, 80, 45, 70, 25, 55];
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-card p-6 ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-primary" />
          <span className="text-sm font-medium">Response Analytics</span>
        </div>
        <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
          Live
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground">Total responses</div>
          <div className="mt-1 text-2xl font-semibold">12,438</div>
          <div className="mt-1 text-xs text-primary">+18.2%</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground">Completion</div>
          <div className="mt-1 text-2xl font-semibold">94%</div>
          <div className="mt-1 text-xs text-primary">+2.4%</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground">Avg. time</div>
          <div className="mt-1 text-2xl font-semibold">38s</div>
          <div className="mt-1 text-xs text-muted-foreground">stable</div>
        </div>
      </div>
      <div className="mt-6 flex h-32 items-end gap-2 rounded-lg border border-border p-4">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${i % 2 === 0 ? "bg-primary" : "bg-primary/40"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Security ──────────────────────────────────────────────────────────────────
function SecuritySection() {
  const securityLayers = [
    { 
      title: "Device Fingerprinting", 
      desc: "We analyze over 20 unique browser attributes to create a digital signature that prevents vote manipulation even without an account.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Persistence Layer", 
      desc: "Encrypted local tokens and secure cookies ensure that once a vote is cast, it's locked in for that specific session and device.",
      icon: Lock,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      title: "Smart IP Tracking", 
      desc: "Automated monitoring of submission patterns identifies and blocks rapid-fire voting attempts from the same network.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 px-6 py-24 border-y border-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Zero-Trust Polling Infrastructure</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Integrity is our top priority. We use a multi-layered security stack to ensure that your data is clean, accurate, and free from duplicates.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {securityLayers.map((layer) => (
            <div key={layer.title} className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className={`size-12 rounded-xl ${layer.bg} ${layer.color} flex items-center justify-center mb-6`}>
                <layer.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{layer.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Analytics ─────────────────────────────────────────────────────────────────
function Analytics() {
  return (
    <section id="product" className="px-6 py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-6 max-w-[20ch] text-balance text-3xl font-semibold tracking-tight">
            Professional analytics for every response
          </h2>
          <p className="mb-8 max-w-[48ch] text-base text-muted-foreground">
            Deep dive into the data. Filter by respondent segments, identify
            trends over time, and export production-ready charts for your next
            presentation.
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
            <div>
              <div className="text-2xl font-semibold">99.9%</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Uptime reliability
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold">1.2s</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avg load time
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex-1">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  const { data: session } = authClient.useSession();

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-2xl bg-primary p-12 text-center md:p-20">
        <h2 className="mb-6 text-3xl font-semibold text-primary-foreground md:text-4xl">
          Ready to start collecting?
        </h2>
        <p className="mx-auto mb-10 max-w-[48ch] text-lg text-primary-foreground/80">
          Join over 10,000 product teams making data-driven decisions every day.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!session ? (
            <>
              <Link
                to="/sign-up"
                className="w-full rounded-lg bg-card px-8 py-3 text-sm font-medium text-primary shadow-xl ring-1 ring-white/10 sm:w-auto"
              >
                Create free account
              </Link>
              <Link
                to="/sign-in"
                className="w-full px-8 py-3 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:w-auto"
              >
                Sign in
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="w-full rounded-lg bg-card px-8 py-3 text-sm font-medium text-primary shadow-xl ring-1 ring-white/10 sm:w-auto"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-3">
          <div className="col-span-1">
            <span className="mb-4 block text-lg font-semibold tracking-tight">PulseLoop</span>
            <p className="max-w-[35ch] text-sm text-muted-foreground">
              The polling platform built for modern product organizations and
              independent creators.
            </p>
          </div>
          <div className="col-span-1 grid grid-cols-2 gap-8 md:col-span-2">
            <div className="space-y-4">
              <h5 className="text-sm font-semibold">Resources</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-sm font-semibold">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PulseLoop Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <ShareStrip />
        <HowItWorks />
        <Features />
        <SecuritySection />
        <Analytics />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
