import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between mx-auto px-6 sm:px-8">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Logo className="scale-90" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-all duration-300">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-all duration-300">How it Works</a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-all duration-300">About</a>
        </nav>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/sign-in">
              <Button variant="ghost" className="text-sm font-bold opacity-60 hover:opacity-100 hover:bg-transparent">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/10">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
