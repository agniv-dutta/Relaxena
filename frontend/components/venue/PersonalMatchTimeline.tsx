export function PersonalMatchTimeline() {
  const rows = [
    { status: 'done', text: 'Arrived at Gate N4', time: '18:45' },
    { status: 'done', text: 'Joined queue at Cloud Coffee', time: '19:12' },
    { status: 'done', text: 'Seat reached', time: '19:30' },
    { status: 'now', text: 'Now: Q3 in progress', time: '20:52' },
    { status: 'next', text: 'Predicted exit window', time: '21:15-21:30' },
  ];

  return (
    <div className="glass rounded-3xl p-6 space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest heading-gradient">Your Event Journey</h3>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.text} className="flex items-start gap-3">
            <span
              className={`mt-1 w-2.5 h-2.5 rounded-full ${
                r.status === 'done' ? 'bg-emerald-400' : r.status === 'now' ? 'bg-blue-400' : 'bg-amber-400'
              }`}
            />
            <div className="flex-1 text-sm">
              <p>{r.text}</p>
            </div>
            <span className="text-xs text-muted-foreground">{r.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
