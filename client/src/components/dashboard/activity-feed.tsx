export function ActivityFeed() {
  const events = [
    { who: "Mira K.", what: "voted on", poll: "Pricing tier preference", when: "just now" },
    { who: "Anonymous", what: "submitted feedback to", poll: "Q3 roadmap", when: "2m ago" },
    { who: "Jonas R.", what: "voted on", poll: "Onboarding A/B", when: "8m ago" },
    { who: "Anonymous", what: "voted on", poll: "Pricing tier preference", when: "12m ago" },
    { who: "Priya S.", what: "shared", poll: "Conference topics", when: "1h ago" },
  ];
  return (
    <div className="rounded-xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Live activity</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Realtime
        </span>
      </div>
      <ul className="mt-4 space-y-4">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-0.5 grid size-7 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              {e.who.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="leading-snug">
                <span className="font-medium">{e.who}</span>{" "}
                <span className="text-muted-foreground">{e.what}</span>{" "}
                <span className="font-medium">{e.poll}</span>
              </p>
              <p className="text-xs text-muted-foreground">{e.when}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
