import { createFileRoute } from "@tanstack/react-router";
import { GameCard, PageIntro } from "@/components/Cards";
import { games } from "@/lib/content";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Games — A Little Something" },
      { name: "description", content: "Little quests on the map. Play to earn points and open keepsakes." },
      { property: "og:title", content: "Games — A Little Something" },
      { property: "og:description", content: "Little quests on the map." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  const p = useProgress();
  return (
    <>
      <PageIntro kicker="a small adventure" title="Minigames">
        Each stage opens the next. Play them in order to earn points and discover what's hidden.
      </PageIntro>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((g, i) => <GameCard key={g.id} g={g} completed={p.games.includes(g.id)} delay={i * 60} />)}
      </div>
    </>
  );
}
