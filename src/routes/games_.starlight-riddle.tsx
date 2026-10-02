import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { completeGame } from "@/lib/progress";

export const Route = createFileRoute("/games_/starlight-riddle")({
  head: () => ({
    meta: [
      { title: "Starlight Riddle — A Little Something" },
      { name: "description", content: "Solve the riddles under the stars to reveal a secret." },
      { property: "og:title", content: "Starlight Riddle — A Little Something" },
      { property: "og:description", content: "A cosy riddle game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StarRiddle,
});

// ✦ Edit riddles here. Any answer in `answers` is accepted (not case-sensitive).
const GAME_ID = "star-riddle";
const POINTS = 100;
const RIDDLES = [
  { q: "I'm flaky and golden, curved like a moon, best with some butter and eaten by noon. What am I?", answers: ["croissant", "a croissant"], hint: "Someone's nickname…" },
  { q: "The more of me you take, the more you leave behind. What am I?", answers: ["footsteps", "steps", "footprints"], hint: "You make them when you walk." },
  { q: "I have keys but open no locks. I have space but no room. What am I?", answers: ["keyboard", "a keyboard"], hint: "You might be near one right now." },
  { q: "I shine at night but I'm not a lamp; I twinkle up high over every camp. What am I?", answers: ["star", "a star", "stars"], hint: "Look at this game's name." },
];
const SECRET = "[Your secret message will go here.]";

const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-z ]/g, "");

function StarRiddle() {
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"" | "wrong" | "right">("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<{ firstTime: boolean; pointsAwarded: number } | null>(null);
  const r = RIDDLES[idx]!;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!guess.trim()) return;
    if (r.answers.map(norm).includes(norm(guess))) {
      setFeedback("right");
      setTimeout(() => {
        if (idx === RIDDLES.length - 1) setResult(completeGame(GAME_ID, POINTS));
        else { setIdx(idx + 1); setGuess(""); setFeedback(""); setShowHint(false); }
      }, 900);
    } else setFeedback("wrong");
  }

  const restart = () => { setIdx(0); setGuess(""); setFeedback(""); setShowHint(false); setResult(null); };
  const btn = "min-h-12 rounded-full px-5 text-sm font-bold";

  return (
    <>
      <header className="rise py-6 lg:py-8">
        <Link to="/games" className="font-hand text-xl text-ink-soft hover:text-ink">← back to games</Link>
        <h1 className="mt-1 font-display text-5xl leading-none">Starlight Riddle</h1>
        <p className="mt-3 max-w-[46ch] text-ink-soft text-pretty">
          Answer each riddle to light a star. Light them all to reveal a secret.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        <div className="mb-4 flex justify-center gap-3 text-3xl" aria-label={`${idx} of ${RIDDLES.length} stars lit`}>
          {RIDDLES.map((_, i) => (
            <span key={i} className={`transition-all ${i < idx || (i === idx && feedback === "right") ? "twinkle text-butter-deep" : "text-ink/15"}`}>★</span>
          ))}
        </div>

        <form key={idx} onSubmit={submit} className="rise paper-card p-6 sm:p-8">
          <p className="font-hand text-xl text-lav-deep">riddle {idx + 1} of {RIDDLES.length}</p>
          <p className="mt-2 font-display text-2xl text-balance">{r.q}</p>
          <input
            value={guess}
            onChange={(e) => { setGuess(e.target.value); setFeedback(""); }}
            placeholder="Your answer…"
            aria-label="Your answer"
            className="mt-5 min-h-12 w-full rounded-2xl bg-cream px-4 ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {feedback === "wrong" && <p className="mt-2 text-sm text-blush-deep">Not quite — the stars are still waiting. Try again!</p>}
          {feedback === "right" && <p className="mt-2 text-sm text-sage-deep">Yes! A star lights up ✦</p>}
          {showHint && <p className="mt-2 font-hand text-lg text-ink-soft">hint: {r.hint}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="submit" className={`${btn} bg-primary text-primary-foreground shadow-rose`}>Answer</button>
            {!showHint && <button type="button" onClick={() => setShowHint(true)} className={`${btn} bg-cream ring-1 ring-ink/10 hover:bg-lav/40`}>Need a hint?</button>}
          </div>
        </form>
      </div>

      {result && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="rise paper-card w-full max-w-md p-8 text-center">
            <div className="floaty mx-auto grid size-20 place-items-center rounded-3xl bg-lav text-4xl">🔮</div>
            <h2 className="mt-5 font-display text-4xl">All stars lit ✦</h2>
            <p className="mt-3 font-hand text-2xl text-rose">{SECRET}</p>
            <p className="mt-3 text-ink-soft">
              {result.firstTime ? `+${result.pointsAwarded} points.` : "You've already claimed these points — this was just for fun."}
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
