import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/Cards";
import { useOpenKeepsake } from "@/components/Keepsake";
import { useProgress } from "@/lib/progress";
import { LETTERS, rewardForLetter } from "@/lib/rewards.config";

export const Route = createFileRoute("/letters")({
  head: () => ({
    meta: [
      { title: "Letters — A Little Something" },
      { name: "description", content: "Folded notes that open one at a time." },
      { property: "og:title", content: "Letters — A Little Something" },
      { property: "og:description", content: "Folded notes that open one at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LettersPage,
});

function LettersPage() {
  const p = useProgress();
  const open = useOpenKeepsake();
  return (
    <>
      <PageIntro kicker="sealed in rose wax" title="Letters">
        Each letter opens when its moment comes. No peeking.
      </PageIntro>
      <div className="grid gap-4 sm:grid-cols-2">
        {LETTERS.map((l, i) => {
          const unlocked = p.letters.includes(l.id);
          const need = rewardForLetter(l.id)?.points;
          const canPreview = need == null || p.points >= need;
          const body = (
            <>
              <span className={`grid size-14 shrink-0 place-items-center rounded-full text-xl ${unlocked ? "bg-blush" : "bg-ink/5 grayscale"}`}>
                {unlocked ? "✉️" : "🔒"}
              </span>
              <span>
                <span className={`block font-display text-xl ${unlocked ? "" : "text-ink-soft"}`}>{l.title}</span>
                <span className="block text-sm text-ink-soft">{unlocked ? "Tap to open" : need ? `Opens at ${need} points.` : "Still sealed."}</span>
              </span>
            </>
          );
          const cls = "rise paper-card flex w-full items-center gap-4 p-5 text-left";
          const style = {
            animationDelay: `${i * 60}ms`,
            ...(canPreview && l.image
              ? {
                  backgroundImage: `url(${l.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : {}),
          };
          return unlocked ? (
            <button key={l.id} type="button" onClick={() => open({ type: "letter", id: l.id })} className={`${cls} transition-transform hover:-translate-y-1`} style={style}>{body}</button>
          ) : (
            <article key={l.id} className={cls} style={style}>{body}</article>
          );
        })}
      </div>
    </>
  );
}
