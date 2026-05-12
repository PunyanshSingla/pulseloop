import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/sign-in">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
          </Link>
          <Link to="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
