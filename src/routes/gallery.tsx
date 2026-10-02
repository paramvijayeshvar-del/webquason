import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageIntro, SectionHeader } from "@/components/Cards";
import { toneBg } from "@/lib/content";
import { PLACEHOLDER_SLOTS, SONGS, TOPICS } from "@/lib/gallery.config";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery & Playlist — A Little Something" },
      { name: "description", content: "A sliding gallery of pictures by topic, and a playlist to listen to while you look." },
      { property: "og:title", content: "Gallery & Playlist — A Little Something" },
      { property: "og:description", content: "Pictures by topic and a playlist made for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GalleryPage,
});

function trackEmbed(url: string) {
  const id = url.match(/track\/([A-Za-z0-9]+)/)?.[1];
  return id ? `https://open.spotify.com/embed/track/${id}?utm_source=generator` : null;
}

function GalleryPage() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const topic = TOPICS[active]!;
  const slots = topic.photos.length > 0 ? topic.photos : Array.from({ length: PLACEHOLDER_SLOTS }, () => null);



  const pick = (i: number) => {
    setActive(i);
    track.current?.scrollTo({ left: 0, behavior: "smooth" });
  };
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const arrow = "grid size-12 place-items-center rounded-full bg-cream text-xl ring-1 ring-ink/10 transition-colors hover:bg-blush/40 focus-visible:outline-2 focus-visible:outline-ring";

  return (
    <>
      <PageIntro kicker="pressed between pages" title="Gallery & playlist">
        Slide through little pictures by topic, and press play on something made just for you.
      </PageIntro>

      <section>
        <SectionHeader title="Picture gallery" aside="slide along →" />
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Gallery topics">
          {TOPICS.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors ${i === active ? "bg-ink text-cream" : "bg-cream/80 text-ink-soft ring-1 ring-ink/5 hover:text-ink"}`}
            >
              {t.title}
            </button>
          ))}
        </div>

        <p className="mb-4 font-hand text-2xl text-ink-soft">{topic.note}</p>

        <div ref={track} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" key={topic.id}>
          {slots.map((photo, i) => (
            <figure key={i} className="rise paper-card w-[78%] shrink-0 snap-center p-3 sm:w-[46%] lg:w-[32%]" style={{ animationDelay: `${i * 60}ms`, rotate: `${(i % 2 ? 1 : -1) * 0.8}deg` }}>
              {photo ? (
                <img src={photo.src} alt={photo.caption ?? topic.title} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
              ) : (
                <div className={`grid aspect-[4/5] w-full place-items-center rounded-xl ${toneBg[topic.tone]} text-center`}>
                  <span className="font-hand text-xl text-ink-soft">a picture<br />goes here</span>
                </div>
              )}
              <figcaption className="mt-3 text-center font-hand text-xl text-ink-soft">{photo?.caption ?? topic.title}</figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-2 flex justify-center gap-3">
          <button type="button" onClick={() => slide(-1)} aria-label="Slide left" className={arrow}>←</button>
          <button type="button" onClick={() => slide(1)} aria-label="Slide right" className={arrow}>→</button>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader title="Our playlist" aside="press play ♪" />
        <p className="mb-5 font-hand text-2xl text-ink-soft">
          Six songs, one from each of us — see who picked what.
        </p>
        <ul className="grid gap-5 sm:grid-cols-2">
          {SONGS.map((song) => {
            const embed = trackEmbed(song.url);
            return (
              <li key={song.url} className="paper-card rise p-4">
                <p className="mb-3 text-sm">
                  <span className="font-semibold">{song.title}</span>
                  <span className="text-ink-soft"> — {song.artist}</span>
                </p>
                {embed ? (
                  <iframe
                    title={`${song.title} — ${song.artist}`}
                    src={embed}
                    width="100%"
                    height="152"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="rounded-2xl border-0"
                  />
                ) : (
                  <p className="font-hand text-xl text-ink-soft">the song link goes here</p>
                )}
                <p className="mt-3 text-center font-hand text-xl text-ink-soft">
                  proposed by {song.proposedBy} ✦
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
