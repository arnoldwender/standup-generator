/* ========================================
   Calendar Widget — shows days since last
   meaningful standup contribution
   ======================================== */

import { motion } from 'framer-motion';

interface Props {
  daysSince: number;
}

export default function CalendarWidget({ daysSince }: Props) {
  return (
    <div className="mb-6 border border-cyan-400/10 p-3 text-center">
      <div className="text-[0.5rem] tracking-[3px] text-cyan-400/25 mb-1">
        DAYS SINCE LAST MEANINGFUL STANDUP CONTRIBUTION
      </div>
      <motion.div
        key={daysSince}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl font-bold"
        style={{
          color: daysSince > 60 ? '#ff4444' : daysSince > 30 ? '#ff9900' : '#00ffff',
          textShadow: `0 0 20px ${daysSince > 60 ? '#ff4444' : daysSince > 30 ? '#ff9900' : '#00ffff'}`,
        }}
      >
        {daysSince}
      </motion.div>
      <div className="text-[0.45rem] tracking-[2px] text-cyan-400/15 mt-1">
        AND COUNTING
      </div>
    </div>
  );
}
