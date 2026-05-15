import { authClient } from "@/lib/auth-client";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { ShareStrip } from "@/components/landing/ShareStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DemoVideo } from "@/components/landing/DemoVideo";
import { Features } from "@/components/landing/Features";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { Analytics } from "@/components/landing/Analytics";
import { CTA } from "@/components/landing/CTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <LandingNavbar session={session} />
      
      <main>
        <Hero session={session} />
        <ShareStrip />
        <HowItWorks />
        <DemoVideo />
        <Features />
        <SecuritySection />
        <Analytics />
        <CTA session={session} />
      </main>

      <LandingFooter />
    </div>
  );
}
