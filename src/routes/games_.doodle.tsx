import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { completeGame } from "@/lib/progress";
import { judgeDrawing, type Verdict } from "@/lib/judge.functions";

export const Route = createFileRoute("/games_/doodle")({
  head: () => ({
    meta: [
      { title: "Doodle Garden — A Little Something" },
      { name: "description", content: "Draw what you're asked and see if the little judge agrees." },
      { property: "og:title", content: "Doodle Garden — A Little Something" },
      { property: "og:description", content: "A cosy drawing game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Doodle,
});

// ✦ Edit game settings here
const GAME_ID = "doodle-game";
const POINTS = 100;
const WINS_NEEDED = 3;
const PROMPTS = ["an apple", "a cat", "a flower", "a house", "a sun", "a heart", "a fish", "a tree", "a croissant", "a star", "a cup of tea", "a butterfly"];
const pick = (not?: string) => {
  const list = PROMPTS.filter((p) => p !== not);
  return list[Math.floor(Math.random() * list.length)]!;
};

function Doodle() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [prompt, setPrompt] = useState(PROMPTS[0]!);
  const [wins, setWins] = useState(0);
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [done, setDone] = useState<{ pointsAwarded: number } | null>(null);
  const judge = useServerFn(judgeDrawing);

  const clear = () => {
    const c = canvas.current, ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#fffaf3";
    ctx.fillRect(0, 0, c.width, c.height);
  };
  useEffect(() => { setPrompt(pick()); clear(); }, []);

  const pos = (e: React.PointerEvent) => {
    const c = canvas.current!, r = c.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height] as const;
  };
  const down = (e: React.PointerEvent) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || busy) return;
    canvas.current!.setPointerCapture(e.pointerId);
    drawing.current = true;
    const [x, y] = pos(e);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1);
    ctx.strokeStyle = "#4a3b3b"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvas.current!.getContext("2d")!;
    const [x, y] = pos(e);
    ctx.lineTo(x, y); ctx.stroke();
  };

  async function submit() {
    if (!canvas.current || busy) return;
    setBusy(true); setVerdict(null);
    try {
      const v = await judge({ data: { prompt, image: canvas.current.toDataURL("image/png") } });
      setVerdict(v);
      if ("good" in v && v.good) {
        const n = wins + 1;
        setWins(n);
        if (n >= WINS_NEEDED) setDone(completeGame(GAME_ID, POINTS));
      }
    } catch {
      setVerdict({ error: "Something went wrong. Try again!" });
    } finally {
      setBusy(false);
    }
  }

  const next = () => { setPrompt(pick(prompt)); setVerdict(null); clear(); };
  const btn = "min-h-12 rounded-full px-5 text-sm font-bold";

  return (
    <>
      <header className="rise py-6 lg:py-8">
        <Link to="/games" className="font-hand text-xl text-ink-soft hover:text-ink">← back to games</Link>
        <h1 className="mt-1 font-display text-5xl leading-none">Doodle Garden</h1>
        <p className="mt-3 max-w-[46ch] text-ink-soft text-pretty">
          Draw what's asked, then show it to the little judge. Get {WINS_NEEDED} drawings approved to finish.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        <div className="paper-card mb-4 flex items-center justify-between gap-3 p-4">
          <p className="font-display text-2xl">Draw <span className="text-rose">{prompt}</span></p>
          <p className="font-hand text-xl text-ink-soft">{wins} / {WINS_NEEDED} ✿</p>
        </div>
        <canvas
          ref={canvas}
          width={600}
          height={600}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (drawing.current = false)}
          onPointerCancel={() => (drawing.current = false)}
          className="aspect-square w-full touch-none rounded-3xl shadow-soft ring-1 ring-ink/10"
          aria-label={`Drawing area: draw ${prompt}`}
        />
        {verdict && (
          <div className={`rise mt-4 rounded-2xl p-4 text-center ${"good" in verdict ? (verdict.good ? "bg-sage/70" : "bg-blush/60") : "bg-butter/60"}`}>
            <p className="font-display text-2xl">{"good" in verdict ? (verdict.good ? "That's lovely! ✓" : "Not quite…") : "Hmm"}</p>
            <p className="mt-1 text-ink-soft">{"good" in verdict ? verdict.message : verdict.error}</p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={clear} disabled={busy} className={`${btn} bg-cream ring-1 ring-ink/10 hover:bg-blush/40`}>Clear</button>
          <button onClick={next} disabled={busy} className={`${btn} bg-cream ring-1 ring-ink/10 hover:bg-blush/40`}>New word</button>
          <button onClick={submit} disabled={busy} className={`${btn} bg-primary text-primary-foreground shadow-rose disabled:opacity-60`}>
            {busy ? "Judging…" : "Show the judge"}
          </button>
        </div>
      </div>

      {done && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="rise paper-card w-full max-w-md p-8 text-center">
            <div className="floaty mx-auto grid size-20 place-items-center rounded-3xl bg-butter text-4xl">🎨</div>
            <h2 className="mt-5 font-display text-4xl">Little artist! ✿</h2>
            <p className="mt-2 text-ink-soft">
              {done.pointsAwarded ? `+${done.pointsAwarded} points for your doodles.` : "You've already claimed these points — this was just for fun."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => { setDone(null); setWins(0); next(); }} className={`${btn} bg-cream ring-1 ring-ink/10`}>Keep drawing</button>
              <Link to="/games" className={`${btn} inline-flex items-center bg-primary text-primary-foreground`}>Back to Games</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
