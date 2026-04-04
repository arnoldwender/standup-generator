/* ========================================
   Achievement Panel — shows all achievements
   with locked/unlocked state
   ======================================== */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS } from '../data/standup-data';

interface Props {
  unlocked: Set<string>;
}

export default function AchievementPanel({ unlocked }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-transparent border border-cyan-400/10 p-3 font-mono cursor-pointer transition-all hover:bg-cyan-400/[0.03]"
      >
        <div className="flex justify-between items-center">
          <span className="text-[0.6rem] tracking-[3px] text-cyan-400/40">
            ACHIEVEMENTS ({unlocked.size}/{ACHIEVEMENTS.length})
          </span>
          <span className="text-[0.6rem] text-cyan-400/30">
            {open ? '\u25B2' : '\u25BC'}
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="mt-2 h-1 bg-cyan-400/10 overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400/40"
            initial={false}
            animate={{ width: `${(unlocked.size / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-x border-b border-cyan-400/10"
          >
            <div className="grid grid-cols-2 gap-1 p-2">
              {ACHIEVEMENTS.map((a) => {
                const isUnlocked = unlocked.has(a.id);
                return (
                  <div
                    key={a.id}
                    className="p-2 border transition-all"
                    style={{
                      borderColor: isUnlocked
                        ? 'rgba(255,215,0,0.25)'
                        : 'rgba(0,255,255,0.06)',
                      background: isUnlocked
                        ? 'rgba(255,215,0,0.04)'
                        : 'transparent',
                      opacity: isUnlocked ? 1 : 0.4,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{isUnlocked ? a.icon : "\u{1F512}"}</span>
                      <div>
                        <div
                          className="text-[0.55rem] tracking-[1px] font-bold"
                          style={{ color: isUnlocked ? '#ffd700' : 'rgba(0,255,255,0.3)' }}
                        >
                          {a.title}
                        </div>
                        <div className="text-[0.45rem] text-cyan-400/25">
                          {isUnlocked ? a.description : '???'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
