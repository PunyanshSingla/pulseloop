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
      {/* Background Noise & Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Sparkles className="w-3 h-3" />
              <span>The next generation of polling</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700">
              POLL WITH <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">PURPOSE.</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
              Stop guessing. Start knowing. PulseLoop gives you the tools to create, share, and analyze feedback with precision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Link to="/sign-up">
                <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 group">
                  Start Creating <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-xl border-2 hover:bg-muted transition-all active:scale-95">
                  Live Preview
                </Button>
              </Link>
            </div>

            {/* Floating Elements Mockup */}
            <div className="mt-24 relative max-w-6xl mx-auto px-4">
              <div className="relative group">
                {/* Main Card */}
                <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-4 shadow-2xl transition-all duration-500 group-hover:shadow-primary/5 group-hover:-translate-y-1">
                  <div className="rounded-2xl border border-border bg-background/80 overflow-hidden">
                    <div className="h-12 border-b border-border bg-muted/20 flex items-center px-6 justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive/20" />
                        <div className="w-3 h-3 rounded-full bg-primary/20" />
                        <div className="w-3 h-3 rounded-full bg-accent/20" />
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Analytics Dashboard</div>
                      <div className="w-12" />
                    </div>
                    <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-3xl font-black tracking-tighter mb-4">Event Satisfaction?</h3>
                          <p className="text-muted-foreground">Real-time feedback from 2,400+ attendees.</p>
                        </div>
                        <div className="space-y-6">
                          {[
                            { label: "Exceeded Expectations", val: 78, color: "bg-primary" },
                            { label: "Met Expectations", val: 18, color: "bg-muted-foreground" },
                            { label: "Below Expectations", val: 4, color: "bg-destructive" }
                          ].map((item, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-sm font-bold">
                                <span>{item.label}</span>
                                <span>{item.val}%</span>
                              </div>
                              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                                  style={{ width: `${item.val}%` }} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center relative">
                        <div className="w-64 h-64 rounded-full border-8 border-primary/10 flex items-center justify-center relative">
                          <PieChart className="w-32 h-32 text-primary opacity-20 absolute" />
                          <div className="text-center">
                            <span className="text-5xl font-black tracking-tighter">78%</span>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">Positive</p>
                          </div>
                          {/* Floating badge */}
                          <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl animate-bounce">
                            NEW RECORD
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping small cards for depth */}
                <div className="hidden lg:block absolute -top-12 -left-12 w-48 p-4 rounded-2xl bg-background/80 border border-border shadow-2xl backdrop-blur-xl animate-in slide-in-from-left-8 duration-1000 delay-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-[10px] font-black tracking-widest uppercase opacity-50">Audience</div>
                  </div>
                  <div className="text-2xl font-black tracking-tighter">2.4k</div>
                  <div className="text-[10px] text-primary font-bold">+12% vs last week</div>
                </div>

                <div className="hidden lg:block absolute -bottom-8 -right-8 w-56 p-4 rounded-2xl bg-background/80 border border-border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-1000 delay-700">
                   <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-[10px] font-black tracking-widest uppercase opacity-50">Live Status</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-bold tracking-tight">Collecting Responses...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-xl">
                <Badge className="mb-4">Features</Badge>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Built for speed. <br />Designed for impact.</h2>
              </div>
              <p className="text-muted-foreground md:max-w-xs font-medium">
                Everything you need to create engaging polls and analyze them in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Rapid Creation",
                  desc: "Zero friction. Go from idea to live poll in under 60 seconds."
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Deep Analytics",
                  desc: "Visual summaries and detailed insights for every single question."
                },
                {
                  icon: <Link2 className="h-6 w-6" />,
                  title: "Smart Sharing",
                  desc: "Unique URLs that look great on any platform or social network."
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Secure Voting",
                  desc: "Choose between anonymous feedback or authenticated responses."
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Time Control",
                  desc: "Set expiry times to automatically close polls and publish results."
                },
                {
                  icon: <MousePointer2 className="h-6 w-6" />,
                  title: "Single Choice",
                  desc: "Optimized for clear, decisive feedback with single-option selection."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/80 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl shadow-sm">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section - Horizontal Scroll feel */}
        <section className="py-32 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">THE WORKFLOW</h2>
               <p className="text-muted-foreground font-medium">Three steps to clarity.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {[
                 { step: "01", title: "CRAFT", desc: "Build your poll with our intuitive multi-question editor. Set your rules." },
                 { step: "02", title: "BROADCAST", desc: "Share your unique PulseLoop link. Respondents can join from any device." },
                 { step: "03", title: "REVEAL", desc: "Analyze the data in real-time. Publish final results when you're ready." }
               ].map((item, i) => (
                 <div key={i} className="relative p-8 rounded-3xl bg-background border border-border shadow-xl">
                   <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary flex items-center justify-center text-primary-foreground font-black text-3xl rounded-full shadow-2xl">
                     {item.step}
                   </div>
                   <h3 className="text-2xl font-black tracking-tighter mb-4 mt-4">{item.title}</h3>
                   <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 container mx-auto px-4 sm:px-8">
          <div className="rounded-[40px] bg-primary text-primary-foreground p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">START THE <br />CONVERSATION.</h2>
              <p className="text-primary-foreground/80 max-w-lg mx-auto mb-12 text-lg font-bold">
                Join the thousands of creators using PulseLoop to get the answers they need.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/sign-up">
                  <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl active:scale-95 transition-all">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="ghost" className="h-16 px-12 text-xl font-black rounded-2xl hover:bg-white/10 text-white">
                    Our Mission
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-border">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <Link to="/" className="group">
                <Logo />
              </Link>
              <p className="text-muted-foreground font-medium max-w-xs">
                Capturing the heartbeat of communities everywhere.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest">Product</h4>
                <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest">Company</h4>
                <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest">Legal</h4>
                <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <p>© 2026 PulseLoop. Built for the Hackathon.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
