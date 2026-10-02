// ✦ Edit rewards and letters here. Everything else reads from this file.
import type { Tone } from "./content";

export type RewardKind = "letter" | "badge" | "secret" | "surprise";

export type RewardConfig = {
  id: string;
  title: string;
  points: number; // unlocks automatically at this many points
  kind: RewardKind;
  emoji: string;
  tone: Tone;
  note: string;
  letterId?: string; // unlocking this reward also unlocks this letter
};

export const REWARDS: RewardConfig[] = [
  { id: "letter-1", title: "Letter #1", points: 100, kind: "letter", emoji: "✉️", tone: "butter", note: "A first folded note.", letterId: "letter-1" },
  { id: "memory-badge", title: "Memory Game Badge", points: 200, kind: "badge", emoji: "🌸", tone: "blush", note: "A pressed-flower badge." },
  { id: "secret-1", title: "Secret Message #1", points: 300, kind: "secret", emoji: "🌙", tone: "lav", note: "Something whispered." },
  { id: "letter-2", title: "Letter #2", points: 500, kind: "letter", emoji: "💌", tone: "butter", note: "A second note, sealed in wax.", letterId: "letter-2" },
  { id: "special-surprise", title: "Special Surprise", points: 750, kind: "surprise", emoji: "🎀", tone: "sage", note: "Wrapped with a ribbon." },
  { id: "final-letter", title: "Final Letter", points: 1000, kind: "letter", emoji: "🕯️", tone: "blush", note: "Kept for the very end.", letterId: "final-letter" },
].sort((a, b) => a.points - b.points) as RewardConfig[];

export type LetterConfig = { id: string; title: string; body: string; image?: string };

export const LETTERS: LetterConfig[] = [
  { id: "letter-1", title: "Letter No. 1", body: "[Your letter will go here.]", image: "/images/letter-1.png" },
  { id: "letter-2", title: "Letter No. 2", body: "[Your letter will go here.]", image: "/images/letter-2.jpg" },
  { id: "final-letter", title: "The Last Letter", body: "[Your letter will go here.]", image: "/images/final-letter.jpg" },
];

export const MAX_POINTS = REWARDS[REWARDS.length - 1]?.points ?? 0;

export const rewardForLetter = (letterId: string) => REWARDS.find((r) => r.letterId === letterId);
