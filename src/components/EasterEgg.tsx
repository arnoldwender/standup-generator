/* ========================================
   Easter Egg Messages — context-aware
   humor based on day and usage patterns
   ======================================== */

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  /** Total generations in this session */
  sessionCount: number;
  /** Whether a standup was just generated */
  show: boolean;
}

/* Get day-based easter egg, if any */
function getDayEasterEgg(): string | null {
  const day = new Date().getDay();
  if (day === 5) return "Standup? On Friday? We don't do that here.";
  return null;
}

/* Get count-based easter egg, if any */
function getCountEasterEgg(count: number): string | null {
  if (count === 10) return "HR would like a word.";
  if (count === 20) return "Your manager has been CC'd on this.";
  if (count === 30) return "IT has flagged your account for 'suspicious productivity simulation'.";
  if (count === 50) return "You've generated more standups than most teams have in a quarter. Respect.";
  return null;
}

export default function EasterEgg({ sessionCount, show }: Props) {
  const dayEgg = show ? getDayEasterEgg() : null;
  const countEgg = show ? getCountEasterEgg(sessionCount) : null;
  const message = countEgg || dayEgg;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 border border-red-500/20 bg-red-500/[0.05] p-3 text-center"
        >
          <div className="text-[0.55rem] tracking-[3px] text-red-500/40 mb-1">
            EASTER EGG
          </div>
          <div className="text-[0.72rem] tracking-[2px] text-red-400/70">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
