// Placeholder content. Rewards and letters live in rewards.config.ts.

export const player = { name: "Beloved Quason" };

export type Tone = "blush" | "sage" | "butter" | "lav";

export type Game = { id: string; title: string; blurb: string; emoji: string; tone: Tone; stage: number; open: boolean; route?: "/games/memory-garden" | "/games/doodle" | "/games/candlelight-trail" | "/games/starlight-riddle" | "/games/firefly-lane" };
export const games: Game[] = [
  { id: "memory-game", title: "Memory Garden", blurb: "Find the matching pairs hidden in the garden.", emoji: "🧩", tone: "sage", stage: 1, open: true, route: "/games/memory-garden" },
  { id: "candle-trail", title: "Candlelight Trail", blurb: "Follow the glowing path to the door.", emoji: "🕯️", tone: "butter", stage: 2, open: true, route: "/games/candlelight-trail" },
  { id: "star-riddle", title: "Starlight Riddle", blurb: "Solve the riddle to reveal a secret.", emoji: "🔮", tone: "lav", stage: 3, open: true, route: "/games/starlight-riddle" },
  { id: "doodle-game", title: "Doodle Garden", blurb: "Draw what's asked and see if the judge agrees.", emoji: "🎨", tone: "blush", stage: 4, open: true, route: "/games/doodle" },
  { id: "firefly-lane", title: "Firefly Lane", blurb: "Catch the drifting lights on the forest road.", emoji: "✨", tone: "sage", stage: 5, open: true, route: "/games/firefly-lane" },
];

export const toneBg: Record<Tone, string> = { blush: "bg-blush", sage: "bg-sage", butter: "bg-butter", lav: "bg-lav" };
export const toneText: Record<Tone, string> = { blush: "text-blush-deep", sage: "text-sage-deep", butter: "text-butter-deep", lav: "text-lav-deep" };
