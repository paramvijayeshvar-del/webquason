// Central progression system: one state, one save/load, one set of actions.
// Future minigames only need: completeGame("memory-game", pointsEarned)
import { useSyncExternalStore } from "react";
import { REWARDS, type RewardConfig } from "./rewards.config";

export type Progress = {
  points: number;
  rewards: string[];
  games: string[];
  letters: string[];
  secrets: string[];
};

const STORAGE_KEY = "little-something:progress:v1";
const INITIAL: Progress = { points: 0, rewards: [], games: [], letters: [], secrets: [] };

let state: Progress = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();
const unlockListeners = new Set<(r: RewardConfig) => void>();

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const p = JSON.parse(raw) as Partial<Progress>;
    return {
      points: Number(p.points) || 0,
      rewards: Array.isArray(p.rewards) ? p.rewards : [],
      games: Array.isArray(p.games) ? p.games : [],
      letters: Array.isArray(p.letters) ? p.letters : [],
      secrets: Array.isArray(p.secrets) ? p.secrets : [],
    };
  } catch {
    return INITIAL;
  }
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    state = load();
    loaded = true;
  }
}

function commit(next: Progress) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

const addUnique = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

// ---------- Reads ----------
export const getProgress = () => (ensureLoaded(), state);
export const getPoints = () => getProgress().points;
export const shouldUnlockReward = (r: RewardConfig, p = getProgress()) =>
  p.points >= r.points && !p.rewards.includes(r.id);
export const nextReward = (p = getProgress()) => REWARDS.find((r) => !p.rewards.includes(r.id));

// ---------- Actions ----------
export function unlockLetter(letterId: string) {
  const p = getProgress();
  if (p.letters.includes(letterId)) return;
  commit({ ...p, letters: addUnique(p.letters, letterId) });
}

export function unlockReward(rewardId: string) {
  const r = REWARDS.find((x) => x.id === rewardId);
  const p = getProgress();
  if (!r || p.rewards.includes(r.id)) return;
  commit({
    ...p,
    rewards: addUnique(p.rewards, r.id),
    letters: r.letterId ? addUnique(p.letters, r.letterId) : p.letters,
  });
  unlockListeners.forEach((l) => l(r));
}

export function checkRewards() {
  REWARDS.forEach((r) => {
    if (shouldUnlockReward(r)) unlockReward(r.id);
  });
}

export function addPoints(amount: number) {
  if (!amount) return;
  const p = getProgress();
  commit({ ...p, points: Math.max(0, p.points + amount) });
  checkRewards();
}

export function markGameCompleted(gameId: string) {
  const p = getProgress();
  if (!p.games.includes(gameId)) commit({ ...p, games: addUnique(p.games, gameId) });
}

export const isGameCompleted = (gameId: string) => getProgress().games.includes(gameId);

/** Records completion. Points are only awarded the first time; replays return firstTime: false. */
export function completeGame(gameId: string, pointsEarned = 0): { firstTime: boolean; pointsAwarded: number } {
  if (isGameCompleted(gameId)) return { firstTime: false, pointsAwarded: 0 };
  markGameCompleted(gameId);
  addPoints(pointsEarned);
  return { firstTime: true, pointsAwarded: pointsEarned };
}

export function discoverSecret(secretId: string) {
  const p = getProgress();
  if (!p.secrets.includes(secretId)) commit({ ...p, secrets: addUnique(p.secrets, secretId) });
}

/** Developer-only: wipe all progress. */
export function resetProgress() {
  commit(INITIAL);
}

// ---------- Subscriptions ----------
export function onRewardUnlocked(fn: (r: RewardConfig) => void) {
  unlockListeners.add(fn);
  return () => { unlockListeners.delete(fn); };
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, () => INITIAL);
}

// Expose testing helpers in development: window.progress.addPoints(100)
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>)["progress"] = {
    addPoints, completeGame, resetProgress, getProgress, unlockReward, discoverSecret,
  };
}
