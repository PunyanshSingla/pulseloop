import { motion } from "framer-motion";
import { Sparkles, Lock, BarChart3, Globe, Zap, CheckCircle2 } from "lucide-react";

export function Features() {
  const features = [
    { icon: Sparkles, title: "AI Poll Builder", desc: "Tell us your topic, and our AI will create professional questions instantly. You can even add AI questions to your existing polls." },
    { icon: Lock, title: "Flexible Access", desc: "Choose who can vote. Set start and end dates, allow anonymous guests, and control multiple submissions with one click." },
    { icon: BarChart3, title: "Voter Insights", desc: "Understand your audience with deep demographics. See top devices, OS, and geographic locations automatically." },
    { icon: Globe, title: "Public Gallery", desc: "Browse a live feed of public polls. Search by topic, participate in trends, and get inspired by other creators." },
    { icon: Zap, title: "Live Results", desc: "Watch your charts update the second someone votes. Share results with your audience or keep them private." },
    { icon: CheckCircle2, title: "Easy Sharing", desc: "Share via secure links or QR codes. Export all your response data to CSV for deeper analysis in other tools." },
  ];
  return (
    <section id="features" className="bg-secondary px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={title} 
              className="flex h-full flex-col rounded-xl bg-card p-8 ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-6 grid size-9 place-items-center rounded bg-muted">
                <Icon className="size-4 text-foreground" />
              </div>
              <h4 className="mb-2 font-medium">{title}</h4>
              <p className="max-w-[35ch] text-pretty text-sm text-muted-foreground">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
