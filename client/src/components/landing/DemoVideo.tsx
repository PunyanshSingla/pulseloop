import { motion } from "framer-motion";

export function DemoVideo() {
  return (
    <section id="demo" className="px-6 py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight mb-4"
          >
            How PulseLoop Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Watch this short video to see how you can start your first poll in less than 2 minutes.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl ring-1 ring-black/5"
        >
          {/* REPLACE THE URL BELOW WITH YOUR ACTUAL YOUTUBE VIDEO URL */}
          <iframe 
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="PulseLoop Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
