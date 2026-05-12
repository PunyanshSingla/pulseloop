import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Link2, 
  Shield, 
  Users, 
  Zap,
  MousePointer2,
  Sparkles,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Background Noise & Dynamic Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/15 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="container mx-auto px-6 sm:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The next generation of polling</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Capture the heartbeat <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">of your audience.</span>
                </h1>
                
                <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-5 duration-1000">
                  Stop guessing. Start knowing. PulseLoop gives you the tools to create, share, and analyze feedback with effortless precision.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <Link to="/sign-up">
                    <Button size="lg" className="h-14 px-8 text-base font-bold rounded-2xl shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 group">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/sign-in">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold rounded-2xl border-2 hover:bg-muted transition-all active:scale-95">
                      Live Preview
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full lg:w-auto relative animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="relative group">
                  {/* Main Card */}
                  <div className="rounded-[32px] border border-border/50 bg-card/40 backdrop-blur-2xl p-2 shadow-2xl transition-all duration-700 group-hover:-translate-y-2">
                    <div className="rounded-[24px] border border-border/50 bg-background/80 overflow-hidden shadow-inner">
                      <div className="h-12 border-b border-border/40 bg-muted/20 flex items-center px-6 justify-between">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-border" />
                          <div className="w-2.5 h-2.5 rounded-full bg-border" />
                          <div className="w-2.5 h-2.5 rounded-full bg-border" />
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Analytics Dashboard</div>
                        <div className="w-8" />
                      </div>
                      <div className="p-8 space-y-8">
                        <div>
                          <h3 className="text-2xl font-bold tracking-tight mb-2">Event Satisfaction?</h3>
                          <p className="text-sm text-muted-foreground/70 font-medium">Real-time feedback loop active.</p>
                        </div>
                        <div className="space-y-6">
                          {[
                            { label: "Exceeded Expectations", val: 78, color: "bg-primary" },
                            { label: "Met Expectations", val: 18, color: "bg-muted-foreground/30" },
                            { label: "Below Expectations", val: 4, color: "bg-destructive/40" }
                          ].map((item, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-xs font-bold tracking-tight">
                                <span className="opacity-60">{item.label}</span>
                                <span>{item.val}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                                  style={{ width: `${item.val}%` }} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements for depth */}
                  <div className="absolute -top-12 -right-8 w-40 p-4 rounded-2xl bg-background/90 border border-border shadow-2xl backdrop-blur-xl animate-bounce duration-[4000ms]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-[10px] font-bold uppercase opacity-40">Live</div>
                    </div>
                    <div className="text-xl font-bold tracking-tighter">2.4k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-48 relative overflow-hidden">
          <div className="container mx-auto px-6 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 text-primary bg-primary/5 text-[10px] font-bold uppercase tracking-widest">Capabilities</Badge>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">Powerful simplicity. <br />Designed for impact.</h2>
              </div>
              <p className="text-muted-foreground md:max-w-xs font-medium text-lg leading-relaxed opacity-70">
                A comprehensive suite of tools designed to help you capture and understand the voice of your audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {[
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Instant Setup",
                  desc: "Zero friction. Go from idea to live poll in under 60 seconds."
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Real-time Insights",
                  desc: "Watch responses roll in and see beautiful live visualizations."
                },
                {
                  icon: <Link2 className="h-6 w-6" />,
                  title: "Smart Sharing",
                  desc: "Unique URLs that look incredible on any platform or social network."
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Advanced Privacy",
                  desc: "Choose between anonymous feedback or authenticated responses."
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Automated Control",
                  desc: "Set expiry times to automatically close polls and publish results."
                },
                {
                  icon: <MousePointer2 className="h-6 w-6" />,
                  title: "Clean Experience",
                  desc: "A focused voting interface that ensures high response rates."
                }
              ].map((feature, i) => (
                <div key={i} className="group flex flex-col items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground/70 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section - Vertical Editorial Path */}
        <section id="how-it-works" className="py-48 relative overflow-hidden bg-muted/5">
          <div className="container mx-auto px-6 sm:px-8">
            <div className="flex flex-col lg:flex-row gap-24">
              <div className="lg:w-1/3 sticky top-32 h-fit">
                <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 text-primary bg-primary/5 text-[10px] font-bold uppercase tracking-widest">Workflow</Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-pretty leading-[1.1]">
                  From curiosity <br />to clarity.
                </h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed opacity-70">
                  We’ve stripped away the complexity to leave you with a refined, three-step journey to audience insights.
                </p>
              </div>

              <div className="lg:w-2/3 space-y-32 relative">
                {/* Visual Path Line */}
                <div className="absolute left-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />

                {[
                  { 
                    step: "01", 
                    title: "Craft Your Narrative", 
                    desc: "Our intuitive editor allows you to build multi-question polls that feel more like a conversation than a survey. Set logic, timing, and privacy with a single click.",
                    icon: <Sparkles className="w-6 h-6" />
                  },
                  { 
                    step: "02", 
                    title: "Broadcast With Impact", 
                    desc: "Deploy your unique PulseLoop link to any platform. Our responsive interface ensures a flawless experience whether your audience is on mobile, tablet, or desktop.",
                    icon: <Link2 className="w-6 h-6" />
                  },
                  { 
                    step: "03", 
                    title: "Reveal The Heartbeat", 
                    desc: "Watch sentiment shift in real-time. Our analytics dashboard doesn’t just show numbers; it reveals the underlying pulse of your community.",
                    icon: <PieChart className="w-6 h-6" />
                  }
                ].map((item, i) => (
                  <div key={i} className="relative pl-0 md:pl-24 group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                    {/* Step Number Bubble */}
                    <div className="absolute -left-4 md:left-0 top-0 w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-primary font-bold text-xl z-10 group-hover:border-primary group-hover:shadow-[0_12px_24px_-8px_rgba(var(--primary),0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
                      {item.step}
                    </div>
                    
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 text-primary/40 mb-4 group-hover:text-primary transition-colors duration-500">
                        {item.icon}
                        <span className="text-xs font-bold uppercase tracking-widest">Step {item.step}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-foreground transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground/70 font-medium text-lg leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 lg:py-48 container mx-auto px-6 sm:px-8">
          <div className="rounded-[48px] bg-gradient-to-br from-foreground to-foreground/90 text-background p-16 md:p-32 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] invert" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px]" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-none">Start the conversation today.</h2>
              <p className="text-background/60 max-w-xl mx-auto mb-16 text-lg md:text-xl font-medium">
                Join thousands of creators who trust PulseLoop to capture what matters most.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/sign-up">
                  <Button size="lg" variant="secondary" className="h-16 px-12 text-lg font-bold rounded-2xl shadow-xl active:scale-95 transition-all">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="ghost" className="h-16 px-12 text-lg font-bold rounded-2xl hover:bg-white/10 text-background">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative pt-32 pb-16 overflow-hidden bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
            <div className="lg:col-span-2 space-y-8">
              <Logo />
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                The next generation of audience intelligence. Refined polling for the modern era.
              </p>
              <div className="flex gap-6">
                {['Twitter', 'GitHub', 'LinkedIn'].map((platform) => (
                  <a 
                    key={platform} 
                    href="#" 
                    aria-label={`Follow us on ${platform}`}
                    className="text-muted-foreground/40 hover:text-primary transition-colors duration-300"
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">{platform}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-12 lg:col-span-2">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Platform</h4>
                <ul className="space-y-4">
                  <li><a href="#features" className="text-muted-foreground/60 hover:text-primary transition-all text-sm font-medium">Features</a></li>
                  <li><a href="#how-it-works" className="text-muted-foreground/60 hover:text-primary transition-all text-sm font-medium">Workflow</a></li>
                  <li><Link to="/sign-in" className="text-muted-foreground/60 hover:text-primary transition-all text-sm font-medium">Sign In</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Legal</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-muted-foreground/60 hover:text-primary transition-all text-sm font-medium">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground/60 hover:text-primary transition-all text-sm font-medium">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground/60 hover:text-primary transition-all text-sm font-medium">Cookie Settings</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
              © {new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date())} PulseLoop Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">System Status: All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Massive Background Mark */}
        <div className="absolute -bottom-24 -right-24 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05]">
          <span className="text-[20rem] font-black tracking-tighter leading-none">PULSE</span>
        </div>
      </footer>
    </div>
  );
}
