import { createFileRoute, Link } from "@tanstack/react-router";
import { GiftBox } from "@/components/GiftBox";
import { ProgressCard } from "@/components/ProgressCard";
import { GameCard, RewardCard, SectionHeader } from "@/components/Cards";
import { useOpenKeepsake } from "@/components/Keepsake";
import { games, player } from "@/lib/content";
import { useProgress } from "@/lib/progress";
import { REWARDS } from "@/lib/rewards.config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Something For You" },
      { name: "description", content: "A small, private adventure made just for you — games, keepsakes and folded notes." },
      { property: "og:title", content: "A Little Something For You" },
      { property: "og:description", content: "A small, private adventure made just for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const p = useProgress();
  const open = useOpenKeepsake();
  return (
    <>
      <section className="grid items-center gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-10">
        <div className="rise">
          <p className="font-hand text-2xl text-rose">
            Dear <span className="text-ink">{player.name}</span>,
          </p>
          <h1 className="mt-1 font-display text-5xl leading-[0.98] text-balance sm:text-6xl">
            A Little Something
            <br />
            For You
          </h1>
          <p className="mt-4 max-w-[42ch] text-ink-soft text-pretty">
            I made this little corner just for you. Open the box slowly — there are games, keepsakes, and a few folded notes waiting inside.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/games"
              className="inline-flex min-h-14 items-center rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-rose transition-transform hover:-translate-y-0.5"
            >
              Begin opening →
            </Link>
            <span className="font-hand text-xl text-ink-soft">it's a kept secret ✧</span>
          </div>
        </div>
        <div className="rise py-6" style={{ animationDelay: "120ms" }}>
          <GiftBox />
        </div>
      </section>

      <ProgressCard />

      <section className="mt-12">
        <SectionHeader title="Rewards collection" aside="tap to unlock" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REWARDS.slice(0, 4).map((r, i) => (
            <RewardCard key={r.id} r={r} unlocked={p.rewards.includes(r.id)} delay={240 + i * 60} onOpen={() => open({ type: "reward", id: r.id })} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title="Minigames on the map" aside="a small adventure" />
        <div className="grid gap-4 sm:grid-cols-3">
          {games.map((g, i) => <GameCard key={g.id} g={g} completed={p.games.includes(g.id)} delay={480 + i * 60} />)}
        </div>
      </section>
    </>
  );
}
