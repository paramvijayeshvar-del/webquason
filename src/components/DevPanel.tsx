import { useState } from "react";
import { addPoints, completeGame, resetProgress } from "@/lib/progress";

/** Developer-only testing controls. Never rendered in the published site. */
export function DevPanel() {
  const [open, setOpen] = useState(false);
  if (!import.meta.env.DEV) return null;
  const btn = "min-h-10 rounded-full bg-cream px-3 text-xs font-semibold ring-1 ring-ink/10 hover:bg-blush/40";
  return (
    <div className="fixed bottom-24 left-3 z-[55] sm:bottom-4">
      {open ? (
        <div className="paper-card flex max-w-[220px] flex-wrap gap-2 p-3">
          <p className="w-full font-hand text-lg text-ink-soft">dev tools</p>
          <button className={btn} onClick={() => addPoints(50)}>+50</button>
          <button className={btn} onClick={() => addPoints(100)}>+100</button>
          <button className={btn} onClick={() => completeGame("memory-game", 100)}>Finish game</button>
          <button className={btn} onClick={() => confirm("Reset all progress?") && resetProgress()}>Reset</button>
          <button className={btn} onClick={() => setOpen(false)}>Hide</button>
        </div>
      ) : (
        <button className={btn} onClick={() => setOpen(true)} aria-label="Open dev tools">🛠</button>
      )}
    </div>
  );
}
