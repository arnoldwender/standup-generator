/* ========================================
   Standup Generator — Main App
   Viral parody app that generates fake
   standup meeting updates with absurd humor
   ======================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { glitchText } from './utils/glitch';
import { generateStandup } from './data/standup-data';
import type { StandupResult, BuzzwordLevel, Role } from './data/standup-data';
import { useAchievements } from './hooks/useAchievements';
import { useCalendar } from './hooks/useCalendar';
import { playDrumroll, playDing, playAchievement } from './hooks/useSound';
import CrtOverlay from './components/CrtOverlay';
import StandupOutput from './components/StandupOutput';
import BuzzwordSlider from './components/BuzzwordSlider';
import RoleSelector from './components/RoleSelector';
import BingoCard from './components/BingoCard';
import SpeedrunMode from './components/SpeedrunMode';
import CalendarWidget from './components/CalendarWidget';
import AchievementToast from './components/AchievementToast';
import AchievementPanel from './components/AchievementPanel';
import EasterEgg from './components/EasterEgg';

const BASE_TITLE = 'STANDUP GENERATOR';

export default function App() {
  /* --- Core state --- */
  const [title, setTitle] = useState(BASE_TITLE);
  const [generated, setGenerated] = useState<StandupResult | null>(null);
  const [totalCount, setTotalCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem('standup-total-count') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [sessionCount, setSessionCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  /* --- Feature state --- */
  const [buzzwordLevel, setBuzzwordLevel] = useState<BuzzwordLevel>('honest');
  const [role, setRole] = useState<Role>('frontend');
  const [showBingo, setShowBingo] = useState(false);
  const usedRoles = useRef<Set<Role>>(new Set());

  /* --- Hooks --- */
  const { unlocked, recentUnlock, unlock, dismissRecent } = useAchievements();
  const { daysSince, increment } = useCalendar();

  /* --- Glitch title effect --- */
  useEffect(() => {
    const iv = setInterval(() => {
      setTitle(glitchText(BASE_TITLE, 0.12));
      setTimeout(() => setTitle(BASE_TITLE), 120);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  /* --- Persist total count --- */
  useEffect(() => {
    localStorage.setItem('standup-total-count', String(totalCount));
  }, [totalCount]);

  /* --- Friday easter egg check --- */
  const isFriday = new Date().getDay() === 5;
  const isMonday = new Date().getDay() === 1;

  /* --- Generate standup with sound effects --- */
  const generate = useCallback(async () => {
    setIsGenerating(true);

    /* Drumroll before blocker reveal */
    await playDrumroll();

    const result = generateStandup(role, buzzwordLevel, sessionCount);
    setGenerated(result);

    const newTotal = totalCount + 1;
    const newSession = sessionCount + 1;
    setTotalCount(newTotal);
    setSessionCount(newSession);
    increment();

    /* Cyan confetti burst on every generation */
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#00ffff', '#00ff41', '#0088ff'],
      origin: { y: 0.7 },
    });

    /* --- Check achievements --- */
    if (newSession === 1) unlock('first');
    if (newTotal >= 10) unlock('serial');
    if (newTotal >= 25) unlock('addict');
    if (buzzwordLevel === 'singularity') unlock('buzzmaster');
    if (isMonday) unlock('monday');
    if (isFriday) unlock('friday');
    if (newSession >= 10) unlock('hr');

    /* Track used roles for Identity Crisis achievement */
    usedRoles.current.add(role);
    if (usedRoles.current.size >= 6) unlock('allroles');

    setIsGenerating(false);
  }, [role, buzzwordLevel, sessionCount, totalCount, increment, unlock, isMonday, isFriday]);

  /* --- Callbacks for child components --- */
  const handleCopy = useCallback(() => {
    unlock('copier');
    playDing();
  }, [unlock]);

  const handleShare = useCallback(() => {
    unlock('shared');
    playAchievement();
  }, [unlock]);

  const handleBingo = useCallback(() => {
    unlock('bingo');
  }, [unlock]);

  const handleSpeedrunComplete = useCallback(() => {
    unlock('speedrun');
  }, [unlock]);

  /* --- Standup text for bingo matching --- */
  const standupText = generated
    ? `${generated.yesterday} ${generated.today} ${generated.blocker} ${generated.mood.label}`
    : '';

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden relative">
      <CrtOverlay />

      {/* Achievement unlock notification */}
      <AchievementToast achievement={recentUnlock} onDismiss={dismissRecent} />

      <div className="max-w-[700px] mx-auto px-6 py-8 relative z-10">
        {/* --- Header --- */}
        <header className="text-center mb-8 border-b border-cyan-400/20 pb-6">
          <div className="text-[0.65rem] tracking-[6px] text-cyan-400/30 mb-2">
            ARNOLD WENDER AGILE PRODUCTIVITY SUITE
          </div>
          <h1 className="text-[clamp(1.4rem,5vw,2.5rem)] font-normal m-0 mb-1 tracking-[4px] title-glow">
            {title}
          </h1>
          <div className="text-[0.7rem] text-cyan-400/50 tracking-[2px]">
            v6.6.6 — SOUND BUSY. DO NOTHING.
          </div>
          <div className="mt-3 flex justify-center gap-6 text-[0.6rem] text-cyan-400/25 flex-wrap">
            <span>SCRUM CERTIFIED</span>
            <span>JIRA COMPLIANT</span>
            <span>AGILE ADJACENT</span>
            <span>STANDUP SURVIVOR</span>
          </div>
        </header>

        {/* --- Global counter --- */}
        <motion.div
          className="text-center mb-6 text-[0.6rem] tracking-[3px] text-cyan-400/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-cyan-400/50 text-[0.7rem]">{totalCount}</span>{' '}
          STANDUPS GENERATED — <span className="text-red-500/40">0</span> WORK ACTUALLY DONE
        </motion.div>

        {/* --- Calendar widget --- */}
        <CalendarWidget daysSince={daysSince} />

        {/* --- Controls: Role + Buzzword --- */}
        <RoleSelector role={role} onChange={setRole} />
        <BuzzwordSlider level={buzzwordLevel} onChange={setBuzzwordLevel} />

        {/* --- Speedrun mode (unlocked at 10 total) --- */}
        <SpeedrunMode
          unlocked={totalCount >= 10}
          onGenerate={generate}
          onComplete={handleSpeedrunComplete}
        />

        {/* --- Generate button --- */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={generate}
            disabled={isGenerating}
            className="generate-btn bg-transparent border border-cyan-400 text-cyan-400 font-mono text-base py-4 px-12 cursor-pointer tracking-[4px] disabled:opacity-40"
            type="button"
          >
            {isGenerating ? 'GENERATING...' : '\u25B6 GENERATE STANDUP'}
          </motion.button>
          <div className="mt-3 text-[0.6rem] text-cyan-400/20 tracking-[2px]">
            {isFriday
              ? "IT'S FRIDAY. STANDUP IS OPTIONAL. JUST LIKE YOUR EFFORT."
              : isMonday
                ? 'MONDAY. THE CRUELEST DAY FOR A STANDUP.'
                : 'CLICK UNTIL IT SOUNDS LIKE YOU'}
          </div>
        </div>

        {/* --- Easter eggs --- */}
        <EasterEgg sessionCount={sessionCount} show={sessionCount > 0} />

        {/* --- Standup output --- */}
        <AnimatePresence mode="wait">
          {generated ? (
            <motion.div
              key={`standup-${sessionCount}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StandupOutput
                result={generated}
                onRegenerate={generate}
                onShare={handleShare}
                onCopy={handleCopy}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-cyan-400/15 text-[0.72rem] tracking-[3px]"
            >
              <div className="text-4xl mb-4">{'\u{1F4CB}'}</div>
              <div>PRESS GENERATE TO SOUND PRODUCTIVE</div>
              <div className="text-[0.6rem] mt-2 text-cyan-400/[0.07]">
                NO ACTUAL WORK REQUIRED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Bingo toggle --- */}
        <div className="mt-6 mb-2 text-center">
          <button
            type="button"
            onClick={() => setShowBingo(!showBingo)}
            className="bg-transparent border border-cyan-400/15 text-cyan-400/30 font-mono text-[0.6rem] py-2 px-6 cursor-pointer tracking-[3px] hover:bg-cyan-400/[0.05] transition-all"
          >
            {showBingo ? 'HIDE BINGO' : 'STANDUP BINGO'}
          </button>
        </div>

        {/* --- Bingo card --- */}
        <AnimatePresence>
          {showBingo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <BingoCard standupText={standupText} onBingo={handleBingo} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Achievements --- */}
        <AchievementPanel unlocked={unlocked} />

        {/* --- Footer --- */}
        <footer className="border-t border-cyan-400/15 pt-6 mt-4 text-center text-[0.58rem] text-cyan-400/15 tracking-[2px] leading-9">
          <div>STANDUP GENERATOR IS NOT RESPONSIBLE FOR PERFORMANCE REVIEWS OR LAYOFFS</div>
          <div>BUILT BY ARNOLD WENDER — OUR STANDUPS ARE ALSO GENERATED</div>
          <div className="text-red-500/15 mt-1">HTTP 418 — YOUR STANDUP IS A TEAPOT</div>
        </footer>
      </div>
    </div>
  );
}
