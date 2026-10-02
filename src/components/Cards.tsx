import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { toneBg, toneText, type Game } from "@/lib/content";
import type { RewardConfig } from "@/lib/rewards.config";

export function SectionHeader({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="font-display text-3xl text-balance">{title}</h2>
      {aside && <span className="font-hand text-xl text-ink-soft">{aside}</span>}
    </div>
  );
}

function Pill({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${on ? "bg-sage/70 text-ink" : "bg-ink/5 text-ink-soft"}`}>
      {children}
    </span>
  );
}

export function RewardCard({ r, unlocked, delay = 0, onOpen }: { r: RewardConfig; unlocked: boolean; delay?: number; onOpen?: () => void }) {
  const inner = (
    <>
      <div className={`grid size-16 place-items-center rounded-2xl text-2xl ${toneBg[r.tone]} ${unlocked ? "" : "opacity-60 blur-[3px]"}`}>{unlocked ? r.emoji : "🎁"}</div>
      <p className={`mt-3 font-display text-lg ${unlocked ? "" : "text-ink-soft"}`}>{r.title}</p>
      <p className="text-sm text-ink-soft">{unlocked ? r.note : `Reach ${r.points} points to open.`}</p>
      <Pill on={unlocked}>{unlocked ? "Unlocked · open" : `Locked · ${r.points} pts`}</Pill>
    </>
  );
  const cls = "rise paper-card keepsake-card block w-full p-4 text-left transition-transform";
  const style = { animationDelay: `${delay}ms` };
  return unlocked && onOpen ? (
    <button type="button" onClick={onOpen} className={`${cls} cursor-pointer hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-ring`} style={style}>{inner}</button>
  ) : (
    <div className={cls} style={style} aria-disabled={!unlocked}>{inner}</div>
  );
}

export function GameCard({ g, completed = false, delay = 0 }: { g: Game; completed?: boolean; delay?: number }) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className={`grid size-12 place-items-center rounded-2xl text-xl ${toneBg[g.tone]}`}>{g.emoji}</span>
        <span className={`font-hand text-lg ${toneText[g.tone]}`}>stage {g.stage}</span>
      </div>
      <p className="mt-4 font-display text-xl">{g.title}</p>
      <p className="mt-1 text-sm text-ink-soft">{g.blurb}</p>
      <Pill on={g.open || completed}>{completed ? "Completed ✓ · play again" : g.route ? "Play →" : g.open ? "Coming soon" : "Locked"}</Pill>
    </>
  );
  const cls = "rise paper-card game-card block p-5 transition-transform hover:-translate-y-1";
  const style = { animationDelay: `${delay}ms` };
  return g.route ? (
    <Link to={g.route} className={`${cls} focus-visible:outline-2 focus-visible:outline-ring`} style={style}>{inner}</Link>
  ) : (
    <div className={cls} style={style}>{inner}</div>
  );
}

export function PageIntro({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <header className="rise py-6 lg:py-10">
      <p className="font-hand text-2xl text-rose">{kicker}</p>
      <h1 className="mt-1 font-display text-5xl leading-none text-balance">{title}</h1>
      <p className="mt-4 max-w-[48ch] text-ink-soft text-pretty">{children}</p>
    </header>
  );
}
