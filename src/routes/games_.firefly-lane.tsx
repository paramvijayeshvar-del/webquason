import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { completeGame } from "@/lib/progress";

export const Route = createFileRoute("/games_/firefly-lane")({
  head: () => ({
    meta: [
      { title: "Firefly Lane — A Little Something" },
      { name: "description", content: "Catch the drifting fireflies on a quiet forest road. Each one carries a sweet little note." },
      { property: "og:title", content: "Firefly Lane — A Little Something" },
      { property: "og:description", content: "Catch the fireflies on a quiet forest road." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FireflyLane,
});

// ✦ Edit game settings here
const GAME_ID = "firefly-lane";
const POINTS = 100;
const TOTAL = 8;
const SENTENCES = [
  "You light up every room the way this little light lights the road.",
  "If kindness glowed, you'd be the brightest thing in this forest.",
  "You make ordinary days feel like small adventures.",
  "Somewhere out there, someone smiles just because you exist.",
  "I hope today is as gentle as you deserve.",
  "Every road is nicer with you walking it.",
  "You are more wonderful than you know, croissant.",
  "One last light — because you've earned every single one.",
];

type Fly = { id: number; x: number; y: number; dur: number; delay: number };

let flyId = 0;
function makeFly(): Fly {
  return {
    id: ++flyId,
    x: 14 + Math.random() * 70,
    y: 14 + Math.random() * 66,
    dur: 4 + Math.random() * 3,
    delay: -Math.random() * 4,
  };
}

const MOTES: Array<[number, number]> = [[15, 18], [82, 14], [28, 72], [72, 84], [10, 52], [90, 58], [48, 10]];

function FireflyLane() {
  const [caught, setCaught] = useState(0);
  const [fly, setFly] = useState<Fly | null>(null);
  const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null);
  const [sentence, setSentence] = useState<string | null>(null);
  const [result, setResult] = useState<{ firstTime: boolean; pointsAwarded: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    setFly(makeFly());
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function catchFly() {
    if (!fly || result) return;
    const { x, y, id } = fly;
    setFly(null);
    setBurst({ x, y, id });
    const n = caught + 1;
    setCaught(n);
    setSentence(SENTENCES[(n - 1) % SENTENCES.length]!);
    timers.current.push(setTimeout(() => setBurst(null), 900));
    if (n >= TOTAL) {
      timers.current.push(setTimeout(() => setResult(completeGame(GAME_ID, POINTS)), 1600));
    } else {
      timers.current.push(setTimeout(() => setFly(makeFly()), 1300));
    }
  }

  const restart = () => {
    timers.current.forEach(clearTimeout);
    setResult(null);
    setCaught(0);
    setSentence(null);
    setBurst(null);
    setFly(makeFly());
  };

  const btn = "min-h-12 rounded-full px-5 text-sm font-bold";

  return (
    <>
      <header className="rise py-6 lg:py-8">
        <Link to="/games" className="font-hand text-xl text-ink-soft hover:text-ink">← back to games</Link>
        <h1 className="mt-1 font-display text-5xl leading-none">Firefly Lane</h1>
        <p className="mt-3 max-w-[46ch] text-ink-soft text-pretty">
          Little lights drift along the forest road. Catch them gently — each one is carrying something sweet for you. Gather {TOTAL} to light up the whole lane.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        <div className="paper-card mb-4 flex items-center justify-between gap-3 p-4">
          <p className="text-ink-soft">{caught < TOTAL ? "Catch the glowing light!" : "The lane is glowing…"}</p>
          <p className="shrink-0 font-hand text-xl text-sage-deep">{caught} / {TOTAL} caught</p>
        </div>

        <div className="forest-scene relative h-[380px] overflow-hidden rounded-3xl shadow-soft sm:h-[460px]">
          {/* winding road */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
            <path d="M 46 104 C 20 84, 82 66, 50 46 C 26 32, 66 16, 52 -4" fill="none" stroke="oklch(0.7 0.08 145 / 0.5)" strokeWidth="72" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d="M 46 104 C 20 84, 82 66, 50 46 C 26 32, 66 16, 52 -4" fill="none" stroke="oklch(0.97 0.013 85 / 0.45)" strokeWidth="3" strokeDasharray="7 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* mist */}
          <div className="absolute -left-10 top-1/3 size-40 rounded-full bg-sage/25 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-8 top-8 size-36 rounded-full bg-lav/20 blur-3xl" aria-hidden="true" />

          {/* twinkling motes */}
          {MOTES.map(([x, y], i) => (
            <span key={i} className="twinkle absolute size-1.5 rounded-full bg-cream/70" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} aria-hidden="true" />
          ))}

          {/* catch burst */}
          {burst && (
            <span key={burst.id} className="pop pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-3xl" style={{ left: `${burst.x}%`, top: `${burst.y}%` }} aria-hidden="true">
              ✨
            </span>
          )}

          {/* the firefly */}
          {fly && (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110" style={{ left: `${fly.x}%`, top: `${fly.y}%` }}>
              <button
                type="button"
                onClick={catchFly}
                aria-label="Catch the firefly"
                className="firefly-glow floaty grid size-11 cursor-pointer place-items-center rounded-full ring-2 ring-butter/60 focus-visible:outline-2 focus-visible:outline-ring"
                style={{ animationDuration: `${fly.dur}s`, animationDelay: `${fly.delay}s` }}
              >
                <span className="block size-4 rounded-full bg-butter-deep" />
              </button>
            </div>
          )}
        </div>

        <div className="paper-card mt-4 flex min-h-20 items-center justify-center p-5 text-center">
          {sentence ? (
            <p key={caught} className="rise font-hand text-2xl text-ink">{sentence}</p>
          ) : (
            <p className="font-hand text-2xl text-ink-soft">Catch a light to hear something sweet…</p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={restart} className={`${btn} bg-cream ring-1 ring-ink/10 hover:bg-blush/40`}>↻ Restart</button>
        </div>
      </div>

      {result && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="rise paper-card w-full max-w-md p-8 text-center">
            <div className="floaty mx-auto grid size-20 place-items-center rounded-3xl bg-sage text-4xl">🏮</div>
            <h2 className="mt-5 font-display text-4xl">The lane is all lit up ✦</h2>
            <p className="mt-2 text-ink-soft">
              {result.firstTime ? `+${result.pointsAwarded} points for lighting the way.` : "You've already claimed these points — this stroll was just for fun."}
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
