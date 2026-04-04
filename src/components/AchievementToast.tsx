/* ========================================
   Achievement Toast — slides in when a
   new achievement is unlocked
   ======================================== */

import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../data/standup-data';

interface Props {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={onDismiss}
          className="fixed top-6 right-6 z-[100] cursor-pointer border border-yellow-400/40 bg-black/95 p-4 backdrop-blur"
          style={{ boxShadow: '0 0 30px rgba(255,215,0,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <div className="text-[0.55rem] tracking-[3px] text-yellow-400/60 mb-0.5">
                ACHIEVEMENT UNLOCKED
              </div>
              <div className="text-[0.75rem] tracking-[2px] text-yellow-400 font-bold">
                {achievement.title}
              </div>
              <div className="text-[0.55rem] tracking-[1px] text-yellow-400/40 mt-0.5">
                {achievement.description}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
