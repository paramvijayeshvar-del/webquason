import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { onRewardUnlocked } from "@/lib/progress";
import { LETTERS, REWARDS, type RewardConfig } from "@/lib/rewards.config";
import { toneBg } from "@/lib/content";

type Opened = { type: "reward"; id: string } | { type: "letter"; id: string } | null;
const Ctx = createContext<(o: Opened) => void>(() => {});
export const useOpenKeepsake = () => useContext(Ctx);

/** Mounted once in the root: reward toasts + the open-a-keepsake modal. */
export function KeepsakeProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<Opened>(null);
  const [toasts, setToasts] = useState<RewardConfig[]>([]);

  useEffect(
    () =>
      onRewardUnlocked((r) => {
        setToasts((t) => [...t, r]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== r.id)), 6000);
      }),
    [],
  );

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpened(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  return (
    <Ctx.Provider value={setOpened}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-3 px-4 sm:bottom-auto sm:right-6 sm:top-6 sm:left-auto sm:items-end">
        {toasts.map((r) => (
          <button
            key={r.id}
            onClick={() => { setOpened({ type: "reward", id: r.id }); setToasts((t) => t.filter((x) => x.id !== r.id)); }}
            className="rise pointer-events-auto flex w-full max-w-sm items-center gap-4 rounded-3xl bg-cream p-4 text-left shadow-box ring-2 ring-blush"
          >
            <span className={`floaty grid size-14 shrink-0 place-items-center rounded-2xl text-2xl ${toneBg[r.tone]}`}>{r.emoji}</span>
            <span>
              <span className="block font-hand text-xl text-rose">Reward unlocked! ✦</span>
              <span className="block font-display text-lg">{r.title}</span>
              <span className="block text-xs text-ink-soft">Tap to open</span>
            </span>
          </button>
        ))}
      </div>

      {opened && <KeepsakeModal opened={opened} onClose={() => setOpened(null)} />}
    </Ctx.Provider>
  );
}

function KeepsakeModal({ opened, onClose }: { opened: NonNullable<Opened>; onClose: () => void }) {
  const reward = opened.type === "reward" ? REWARDS.find((r) => r.id === opened.id) : undefined;
  const letterId = opened.type === "letter" ? opened.id : reward?.letterId;
  const letter = letterId ? LETTERS.find((l) => l.id === letterId) : undefined;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="rise paper-card relative w-full max-w-md p-7 text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-ink-soft hover:bg-blush/40">✕</button>
        <span className="twinkle absolute left-5 top-5 text-rose">✦</span>
        <div className={`mx-auto grid size-20 place-items-center rounded-3xl text-3xl ${toneBg[reward?.tone ?? "butter"]}`}>{reward?.emoji ?? "✉️"}</div>
        <p className="mt-4 font-hand text-xl text-rose">{letter ? "a folded note" : "a keepsake"}</p>
        <h2 className="font-display text-3xl">{letter?.title ?? reward?.title}</h2>
        <p className="mx-auto mt-4 max-w-[36ch] whitespace-pre-line text-ink-soft">
          {letter ? letter.body : "[Your reward will go here.]"}
        </p>
        {reward?.letterId && (
          <Link to="/letters" onClick={onClose} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-rose">
            Go to Letters →
          </Link>
        )}
      </div>
    </div>
  );
}
