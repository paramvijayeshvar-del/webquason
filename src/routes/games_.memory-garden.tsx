import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { completeGame } from "@/lib/progress";
import card1 from "@/assets/memory/card1.jpg.asset.json";
import card2 from "@/assets/memory/card2.jpg.asset.json";
import card3 from "@/assets/memory/card3.jpg.asset.json";
import card4 from "@/assets/memory/card4.jpg.asset.json";
import card5 from "@/assets/memory/card5.jpg.asset.json";
import card6 from "@/assets/memory/card6.jpg.asset.json";

export const Route = createFileRoute("/games_/memory-garden")({
  head: () => ({
    meta: [
      { title: "Memory Garden — A Little Something" },
      { name: "description", content: "Turn over the cards and find every matching pair in the garden." },
      { property: "og:title", content: "Memory Garden — A Little Something" },
      { property: "og:description", content: "A gentle memory-matching game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MemoryGarden,
});

// ✦ Edit game settings & wording here
const GAME_ID = "memory-game";
const POINTS = 100;
const SYMBOLS = [card1, card2, card3, card4, card5, card6].map((a, i) => ({ s: a.url, label: `picture ${i + 1}` }));
const TEXT = {
  winTitle: "Garden complete! ✿",
  winLine: "You found every little secret.",
  congrats:
    "oh my, croissant You've won a game already, good job! I'm so proud of you, now you can go check if you have received any rewards hehe. If you didn't that's okay, do another game :3",
};

type Card = { id: number; pair: number };
const ordered = (): Card[] => SYMBOLS.flatMap((_, i) => [{ id: i * 2, pair: i }, { id: i * 2 + 1, pair: i }]);
function shuffled(): Card[] {
  const a = ordered();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function MemoryGarden() {
  const [cards, setCards] = useState<Card[]>(ordered);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [justMatched, setJustMatched] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [result, setResult] = useState<{ firstTime: boolean; pointsAwarded: number } | null>(null);
  const [round, setRound] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const restart = useCallback(() => {
    clearTimeout(timer.current);
    setCards(shuffled());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setResult(null);
    setRound((r) => r + 1);
  }, []);

  useEffect(() => {
    restart();
    return () => clearTimeout(timer.current);
  }, [restart]);

  const won = matched.length === SYMBOLS.length;

  useEffect(() => {
    if (!won || result) return;
    const t = setTimeout(() => setResult(completeGame(GAME_ID, POINTS)), 700);
    return () => clearTimeout(t);
  }, [won, result]);

  function flip(idx: number) {
    const c = cards[idx]!;
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(c.pair)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const a = cards[next[0]!]!, b = cards[next[1]!]!;
    if (a.pair === b.pair) {
      setMatched((m) => [...m, a.pair]);
      setJustMatched(a.pair);
      setFlipped([]);
      timer.current = setTimeout(() => setJustMatched(null), 600);
    } else {
      timer.current = setTimeout(() => setFlipped([]), 900);
    }
  }

  return (
    <>
      <header className="rise flex flex-wrap items-end justify-between gap-4 py-6 lg:py-8">
        <div>
          <Link to="/games" className="font-hand text-xl text-ink-soft hover:text-ink">← back to games</Link>
          <h1 className="mt-1 font-display text-5xl leading-none">Memory Garden</h1>
          <p className="mt-3 max-w-[46ch] text-ink-soft text-pretty">
            Turn over two cards at a time. Find all six matching pairs to bring the garden into bloom.
          </p>
        </div>
      </header>

      <div className="rise paper-card mb-5 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5" style={{ animationDelay: "80ms" }}>
        <div className="flex gap-6">
          <Stat label="moves" value={moves} />
          <Stat label="pairs" value={`${matched.length} / ${SYMBOLS.length}`} />
        </div>
        <div className="flex gap-2">
          <button onClick={restart} className="min-h-12 rounded-full bg-cream px-5 text-sm font-bold ring-1 ring-ink/10 hover:bg-blush/40">↻ Restart</button>
          <Link to="/games" className="inline-flex min-h-12 items-center rounded-full bg-ink px-5 text-sm font-bold text-cream">Back to Games</Link>
        </div>
      </div>

      <div key={round} className="mx-auto grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((c, idx) => {
          const isMatched = matched.includes(c.pair);
          const up = isMatched || flipped.includes(idx);
          const sym = SYMBOLS[c.pair]!;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => flip(idx)}
              aria-label={up ? `Card ${sym.label}` : "Face-down card"}
              disabled={isMatched}
              className="rise perspective aspect-[3/4] w-full touch-manipulation select-none"
              style={{ animationDelay: `${120 + idx * 30}ms` }}
            >
              <span className={`preserve-3d relative block size-full transition-transform duration-500 ${up ? "rotate-y-180" : ""} ${justMatched === c.pair ? "pop" : ""}`}>
                <span className="backface-hidden absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-blush to-lav shadow-soft ring-1 ring-ink/5">
                  <span className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-cream/60" />
                  <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-cream/60" />
                  <span className="relative grid size-8 place-items-center rounded-full bg-cream/90 text-sm text-rose">✦</span>
                </span>
                <span className={`backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ${isMatched ? "ring-2 ring-sage-deep" : "ring-ink/5"}`}>
                  <img src={sym.s} alt="" draggable={false} className="size-full object-cover" />
                  {isMatched && <span className="absolute right-2 top-2 text-sm text-sage-deep">✓</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {result && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="rise paper-card relative w-full max-w-md p-8 text-center">
            <span className="twinkle absolute left-6 top-6 text-rose">✦</span>
            <span className="twinkle absolute right-8 top-10 text-sage-deep" style={{ animationDelay: "1s" }}>♥</span>
            <span className="drift absolute bottom-8 left-10 text-lav-deep">✿</span>
            <div className="floaty mx-auto grid size-20 place-items-center rounded-3xl bg-sage text-4xl">🌸</div>
            <h2 className="mt-5 font-display text-4xl">{TEXT.winTitle}</h2>
            <p className="mt-1 font-hand text-2xl text-rose">{TEXT.winLine}</p>
            <p className="mx-auto mt-4 max-w-[34ch] text-ink-soft">{TEXT.congrats}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-butter/60 p-3"><p className="font-display text-3xl">{moves}</p><p className="text-xs uppercase tracking-[0.15em] text-ink-soft">moves</p></div>
              <div className="rounded-2xl bg-blush/60 p-3">
                <p className="font-display text-3xl text-rose">+{result.pointsAwarded}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">points</p>
              </div>
            </div>
            {!result.firstTime && <p className="mt-3 text-sm text-ink-soft">You've already claimed this garden's points — this round was just for fun.</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={restart} className="min-h-12 rounded-full bg-cream px-6 font-bold ring-1 ring-ink/10 hover:bg-blush/40">Play again</button>
              <Link to="/games" className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-rose">Back to Games</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="font-display text-2xl text-rose">{value}</p>
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">{label}</p>
    </div>
  );
}
