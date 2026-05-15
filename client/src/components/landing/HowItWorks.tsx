import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    { n: "1", title: "Create", desc: "Write your questions or let our Gemini AI build the whole poll for you in seconds." },
    { n: "2", title: "Share", desc: "Send your poll link to anyone. You can make it public for everyone or private for your team." },
    { n: "3", title: "Analyze", desc: "Watch responses come in live. See deep insights about your voters and export data to CSV." },
  ];
  return (
    <section id="how" className="bg-card px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-3xl font-semibold tracking-tight"
        >
          Three steps to clarity
        </motion.h2>
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={s.n} 
              className="space-y-4"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-accent font-semibold text-accent-foreground">
                {s.n}
              </div>
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="max-w-[35ch] text-pretty text-sm text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
