import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { completeGame } from "@/lib/progress";

export const Route = createFileRoute("/games_/candlelight-trail")({
  head: () => ({
    meta: [
      { title: "Candlelight Trail — A Little Something" },
      { name: "description", content: "Watch the candles light a path, then follow it to the door." },
      { property: "og:title", content: "Candlelight Trail — A Little Something" },
      { property: "og:description", content: "A gentle path-memory game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CandleTrail,
});

// ✦ Edit game settings here
const GAME_ID = "candle-trail";
const POINTS = 100;
const SIZE = 5; // 5x5 grid
const LEVELS = [4, 5, 6, 7]; // path length per level

const neighbours = (i: number) => {
  const r = Math.floor(i / SIZE), c = i % SIZE, out: number[] = [];
  if (r > 0) out.push(i - SIZE);
  if (r < SIZE - 1) out.push(i + SIZE);
  if (c > 0) out.push(i - 1);
  if (c < SIZE - 1) out.push(i + 1);
  return out;
};
function makePath(len: number): number[] {
  for (;;) {
    const path = [Math.floor(Math.random() * SIZE * SIZE)];
    while (path.length < len) {
      const opts = neighbours(path[path.length - 1]!).filter((n) => !path.includes(n));
      if (!opts.length) break;
      path.push(opts[Math.floor(Math.random() * opts.length)]!);
    }
    if (path.length === len) return path;
  }
}

type Phase = "ready" | "showing" | "input" | "oops" | "cleared";

function CandleTrail() {
  const [level, setLevel] = useState(0);
  const [path, setPath] = useState<number[]>([]);
  const [lit, setLit] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [result, setResult] = useState<{ firstTime: boolean; pointsAwarded: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function show(lvl = level) {
    timers.current.forEach(clearTimeout);
    const p = makePath(LEVELS[lvl]!);
    setPath(p); setSteps([]); setWrong(null); setLit([]); setPhase("showing");
    p.forEach((cell, i) => timers.current.push(setTimeout(() => setLit(p.slice(0, i + 1)), 500 + i * 550)));
    timers.current.push(setTimeout(() => { setLit([]); setPhase("input"); }, 500 + p.length * 550 + 900));
  }

  function tap(i: number) {
    if (phase !== "input" || steps.includes(i)) return;
    if (path[steps.length] !== i) { setWrong(i); setPhase("oops"); return; }
    const next = [...steps, i];
    setSteps(next);
    if (next.length === path.length) {
      if (level === LEVELS.length - 1) {
        setPhase("cleared");
        timers.current.push(setTimeout(() => setResult(completeGame(GAME_ID, POINTS)), 600));
      } else {
        setPhase("cleared");
      }
    }
  }

  const nextLevel = () => { const l = level + 1; setLevel(l); show(l); };
  const restart = () => { setResult(null); setLevel(0); show(0); };
  const btn = "min-h-12 rounded-full px-5 text-sm font-bold";
  const message: Record<Phase, string> = {
    ready: "Press Start and watch the candles closely.",
    showing: "Watch the trail…",
    input: `Your turn — tap the candles in order (${steps.length} / ${path.length}).`,
    oops: "The candle flickered out. Try that trail again!",
    cleared: level === LEVELS.length - 1 ? "You reached the door!" : "Trail found! Ready for a longer one?",
  };

  return (
    <>
      <header className="rise py-6 lg:py-8">
        <Link to="/games" className="font-hand text-xl text-ink-soft hover:text-ink">← back to games</Link>
        <h1 className="mt-1 font-display text-5xl leading-none">Candlelight Trail</h1>
        <p className="mt-3 max-w-[46ch] text-ink-soft text-pretty">
          The candles light a path one by one. Remember it, then tap them in the same order. Clear {LEVELS.length} trails to reach the door.
        </p>
      </header>

      <div className="mx-auto max-w-md">
        <div className="paper-card mb-4 flex items-center justify-between gap-3 p-4">
          <p className="text-ink-soft">{message[phase]}</p>
          <p className="shrink-0 font-hand text-xl text-butter-deep">trail {level + 1} / {LEVELS.length}</p>
        </div>

        <div className="grid grid-cols-5 gap-2 rounded-3xl bg-ink/80 p-3 shadow-soft sm:gap-3 sm:p-4">
          {Array.from({ length: SIZE * SIZE }, (_, i) => {
            const on = lit.includes(i) || steps.includes(i);
            const bad = wrong === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => tap(i)}
                aria-label={`Candle ${i + 1}${on ? ", lit" : ""}`}
                className={`grid aspect-square touch-manipulation place-items-center rounded-2xl text-2xl transition-all duration-300 ${
                  bad ? "bg-blush-deep/70" : on ? "scale-105 bg-butter shadow-[0_0_24px_var(--butter)]" : "bg-cream/10 hover:bg-cream/20"
                }`}
              >
                <span className={on ? "" : "opacity-30 grayscale"}>🕯️</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {phase === "ready" && <button onClick={() => show()} className={`${btn} bg-primary text-primary-foreground shadow-rose`}>Start</button>}
          {phase === "oops" && <button onClick={() => show()} className={`${btn} bg-primary text-primary-foreground shadow-rose`}>Try again</button>}
          {phase === "cleared" && level < LEVELS.length - 1 && <button onClick={nextLevel} className={`${btn} bg-primary text-primary-foreground shadow-rose`}>Next trail →</button>}
          <button onClick={restart} className={`${btn} bg-cream ring-1 ring-ink/10 hover:bg-blush/40`}>↻ Restart</button>
        </div>
      </div>

      {result && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="rise paper-card w-full max-w-md p-8 text-center">
            <div className="floaty mx-auto grid size-20 place-items-center rounded-3xl bg-butter text-4xl">🚪</div>
            <h2 className="mt-5 font-display text-4xl">You found the door ✦</h2>
            <p className="mt-2 text-ink-soft">
              {result.firstTime ? `+${result.pointsAwarded} points for lighting the way.` : "You've already claimed these points — this walk was just for fun."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={restart} className={`${btn} bg-cream ring-1 ring-ink/10`}>Play again</button>
              <Link to="/games" className={`${btn} inline-flex items-center bg-primary text-primary-foreground`}>Back to Games</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
