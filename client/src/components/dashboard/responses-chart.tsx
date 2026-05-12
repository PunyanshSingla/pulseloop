export function ResponsesChart() {
  const data = [12, 18, 14, 22, 28, 24, 31, 36, 30, 41, 48, 44, 52, 60, 55, 68, 72];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 600;
  const h = 180;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / (max - min)) * (h - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">Responses over time</p>
          <p className="text-xs text-muted-foreground">Last 17 days</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5 text-xs">
          {["7d", "30d", "90d"].map((p, i) => (
            <button
              key={p}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                i === 1 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full overflow-visible">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="0"
              x2={w}
              y1={(h / 3) * i}
              y2={(h / 3) * i}
              stroke="var(--border)"
              strokeDasharray="3 4"
            />
          ))}
          <polygon points={area} fill="url(#chartFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((v, i) => {
            const x = i * step;
            const y = h - ((v - min) / (max - min)) * (h - 20) - 10;
            return <circle key={i} cx={x} cy={y} r="2" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />;
          })}
        </svg>
      </div>
    </div>
  );
}
