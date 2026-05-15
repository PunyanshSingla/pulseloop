import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-3">
          <div className="col-span-1">
            <Logo className="mb-4" />
            <p className="max-w-[35ch] text-sm text-muted-foreground">
              The polling platform built for modern product organizations and
              independent creators.
            </p>
          </div>
          <div className="col-span-1 grid grid-cols-2 gap-8 md:col-span-2">
            <div className="space-y-4">
              <h5 className="text-sm font-semibold">Platform</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/explore" className="hover:text-foreground transition-colors">Explore Polls</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link to="/sign-up" className="hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-sm font-semibold">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
                <li><a href="mailto:support@pulseloop.io" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PulseLoop. Built for modern feedback loops.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
