/* ========================================
   Achievement system — tracks unlocked
   achievements in localStorage
   ======================================== */

import { useState, useCallback, useEffect } from 'react';
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

  /* Persist to localStorage whenever unlocked changes */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]));
  }, [unlocked]);

  const unlock = useCallback(
    (id: string) => {
      if (unlocked.has(id)) return;
      setUnlocked((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
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
