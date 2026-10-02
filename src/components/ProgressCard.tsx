import { nextReward, useProgress } from "@/lib/progress";
import { MAX_POINTS, REWARDS } from "@/lib/rewards.config";

export function ProgressCard() {
  const p = useProgress();
  const next = nextReward(p);
  const pct = MAX_POINTS ? Math.min(100, (p.points / MAX_POINTS) * 100) : 0;

  return (
    <section className="rise paper-card p-5 sm:p-6" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-butter text-lg">✦</span>
          <div>
            <p className="font-display text-xl">Your little journey</p>
            <p className="text-sm text-ink-soft">
              {p.rewards.length} of {REWARDS.length} keepsakes · {p.games.length} {p.games.length === 1 ? "game" : "games"} completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl text-rose">{p.points}</p>
          <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">points</p>
        </div>
      </div>
      <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-blush/50" role="progressbar" aria-valuenow={p.points} aria-valuemin={0} aria-valuemax={MAX_POINTS}>
        <div className="h-full rounded-full bg-gradient-to-r from-rose to-lav-deep transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
        {REWARDS.slice(0, -1).map((r) => (
          <span key={r.id} className="absolute top-0 h-full w-0.5 bg-cream/80" style={{ left: `${(r.points / MAX_POINTS) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-ink-soft">
        <span>{p.points} / {MAX_POINTS} points</span>
        <span className="font-semibold">
          {next ? `${next.points - p.points} more to unlock ${next.title}` : "Everything unlocked ✦"}
        </span>
      </div>
    </section>
  );
}
