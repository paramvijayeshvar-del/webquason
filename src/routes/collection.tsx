import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, RewardCard } from "@/components/Cards";
import { useOpenKeepsake } from "@/components/Keepsake";
import { useProgress } from "@/lib/progress";
import { REWARDS } from "@/lib/rewards.config";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — A Little Something" },
      { name: "description", content: "Every keepsake you've gathered along the way." },
      { property: "og:title", content: "Collection — A Little Something" },
      { property: "og:description", content: "Every keepsake you've gathered along the way." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const p = useProgress();
  const open = useOpenKeepsake();
  return (
    <>
      <PageIntro kicker="pressed between pages" title="Your collection">
        Keepsakes you've found so far. The blurry ones are still waiting for you.
      </PageIntro>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REWARDS.map((r, i) => (
          <RewardCard key={r.id} r={r} unlocked={p.rewards.includes(r.id)} delay={i * 60} onOpen={() => open({ type: "reward", id: r.id })} />
        ))}
      </div>
    </>
  );
}
