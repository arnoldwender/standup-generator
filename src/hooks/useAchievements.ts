/* ========================================
   Achievement system — tracks unlocked
   achievements in localStorage
   ======================================== */

import { useState, useCallback } from 'react';
import { ACHIEVEMENTS } from '../data/standup-data';
import type { Achievement } from '../data/standup-data';

const STORAGE_KEY = 'standup-achievements';

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  /* Recently unlocked — for showing notification */
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  /* Persist only when an achievement is unlocked — an effect on `unlocked` would write on page load (§ 25 TDDDG) */
  const unlock = useCallback(
    (id: string) => {
      if (unlocked.has(id)) return;
      const next = new Set(unlocked);
      next.add(id);
      setUnlocked(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* localStorage unavailable */
      }
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        setRecentUnlock(achievement);
        /* Auto-dismiss after 3 seconds */
        setTimeout(() => setRecentUnlock(null), 3000);
      }
    },
    [unlocked],
  );

  return {
    unlocked,
    recentUnlock,
    unlock,
    allAchievements: ACHIEVEMENTS,
    dismissRecent: () => setRecentUnlock(null),
  };
}
