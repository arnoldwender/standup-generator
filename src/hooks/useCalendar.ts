/* ========================================
   Calendar widget — tracks days since
   last meaningful standup contribution
   ======================================== */

import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'standup-start-date';

export function useCalendar() {
  const [daysSince, setDaysSince] = useState(0);
  /* Start date kept in memory until the first standup is generated: writing it on the
     first visit stored data before any user action (§ 25 TDDDG). */
  const startDateRef = useRef<string | null>(null);
  const persistedRef = useRef(false);

  useEffect(() => {
    let startDate: string | null = null;
    try {
      startDate = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* localStorage unavailable */
    }
    persistedRef.current = startDate !== null;
    if (!startDate) {
      /* Random date 30-90 days ago for comedic effect on first visit */
      const daysAgo = 30 + Math.floor(Math.random() * 60);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      startDate = d.toISOString();
    }
    startDateRef.current = startDate;
    const diff = Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    setDaysSince(diff);
  }, []);

  /* Increment by 1 each time called (when generating standup); persists the start date once */
  const increment = useCallback(() => {
    if (!persistedRef.current && startDateRef.current) {
      try {
        localStorage.setItem(STORAGE_KEY, startDateRef.current);
        persistedRef.current = true;
      } catch {
        /* localStorage unavailable */
      }
    }
    setDaysSince((d) => d + 1);
  }, []);

  return { daysSince, increment };
}
