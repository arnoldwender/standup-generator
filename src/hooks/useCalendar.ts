/* ========================================
   Calendar widget — tracks days since
   last meaningful standup contribution
   ======================================== */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'standup-start-date';

export function useCalendar() {
  const [daysSince, setDaysSince] = useState(0);

  useEffect(() => {
    let startDate = localStorage.getItem(STORAGE_KEY);
    if (!startDate) {
      /* Set to a random date 30-90 days ago for comedic effect on first visit */
      const daysAgo = 30 + Math.floor(Math.random() * 60);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      startDate = d.toISOString();
      localStorage.setItem(STORAGE_KEY, startDate);
    }
    const diff = Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    setDaysSince(diff);
  }, []);

  /* Increment by 1 each time called (when generating standup) */
  const increment = () => setDaysSince((d) => d + 1);

  return { daysSince, increment };
}
