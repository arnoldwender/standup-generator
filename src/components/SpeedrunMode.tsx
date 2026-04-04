/* ========================================
   Speedrun Mode — 5-second countdown
   to generate a standup under pressure
   ======================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTick, playFanfare } from '../hooks/useSound';

interface Props {
  unlocked: boolean;
  onGenerate: () => void;
  onComplete: () => void;
}

export default function SpeedrunMode({ unlocked, onGenerate, onComplete }: Props) {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setActive(true);
    setCountdown(5);
    setCompleted(false);
  }, []);

  /* Countdown timer */
  useEffect(() => {
    if (!active || completed) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          /* Time's up — auto-generate if user didn't */
          if (intervalRef.current) clearInterval(intervalRef.current);
          setCompleted(true);
          return 0;
        }
        playTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, completed]);

  /* Handle generate during speedrun */
  const handleSpeedGenerate = () => {
    if (!active || completed) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCompleted(true);
    onGenerate();
    onComplete();
    playFanfare();
  };

  if (!unlocked) return null;

  return (
    <div className="mb-6 border border-yellow-400/20 bg-yellow-400/[0.03] p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.6rem] tracking-[3px] text-yellow-400/60">
          SPEEDRUN MODE
        </span>
        <span className="text-[0.5rem] tracking-[2px] text-yellow-400/30">
          UNLOCKED AT 10 STANDUPS
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <button
              onClick={start}
              className="bg-transparent border border-yellow-400/40 text-yellow-400/70 font-mono text-[0.7rem] py-3 px-8 cursor-pointer tracking-[3px] hover:bg-yellow-400/10 transition-all"
            >
              START SPEEDRUN
            </button>
            <div className="text-[0.5rem] text-yellow-400/25 mt-2 tracking-[2px]">
              GENERATE A STANDUP IN 5 SECONDS. GO.
            </div>
          </motion.div>
        ) : completed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2"
          >
            <div className="text-2xl mb-1">
              {countdown > 0 ? "\u23F1" : "\u{1F4A5}"}
            </div>
            <div
              className="text-[0.7rem] tracking-[3px]"
              style={{ color: countdown > 0 ? '#00ff41' : '#ff4444' }}
            >
              {countdown > 0
                ? `SPEED: ${5 - countdown}s! NEW STANDUP RECORD!`
                : "TIME'S UP! YOUR STANDUP WAS TOO SLOW!"}
            </div>
            <button
              onClick={() => {
                setActive(false);
                setCompleted(false);
              }}
              className="mt-2 bg-transparent border border-yellow-400/20 text-yellow-400/40 font-mono text-[0.55rem] py-1.5 px-4 cursor-pointer tracking-[2px] hover:bg-yellow-400/10 transition-all"
            >
              TRY AGAIN
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-5xl font-bold mb-2"
              style={{
                color: countdown <= 2 ? '#ff4444' : '#ffd700',
                textShadow: `0 0 30px ${countdown <= 2 ? '#ff4444' : '#ffd700'}`,
              }}
            >
              {countdown}
            </motion.div>
            <button
              onClick={handleSpeedGenerate}
              className="generate-btn bg-transparent border-2 border-red-500 text-red-400 font-mono text-base py-3 px-10 cursor-pointer tracking-[4px] animate-pulse"
            >
              GENERATE NOW!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
