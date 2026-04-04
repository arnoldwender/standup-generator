import { useState, useEffect } from 'react';
import { YESTERDAY, TODAY, BLOCKERS, MOODS } from './data/standup-data';
import type { StandupResult } from './data/standup-data';
import { glitchText, pickRandom } from './utils/glitch';
import CrtOverlay from './components/CrtOverlay';
import StandupOutput from './components/StandupOutput';

const BASE_TITLE = 'STANDUP GENERATOR';

export default function App() {
  const [title, setTitle] = useState(BASE_TITLE);
  const [generated, setGenerated] = useState<StandupResult | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setTitle(glitchText(BASE_TITLE, 0.12));
      setTimeout(() => setTitle(BASE_TITLE), 120);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  function generate() {
    setGenerated({
      yesterday: pickRandom(YESTERDAY),
      today: pickRandom(TODAY),
      blocker: pickRandom(BLOCKERS),
      mood: pickRandom(MOODS),
    });
    setCount((c) => c + 1);
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden relative">
      <CrtOverlay />

      <div className="max-w-[700px] mx-auto px-6 py-8 relative z-10">
        <header className="text-center mb-8 border-b border-cyan-400/20 pb-6">
          <div className="text-[0.65rem] tracking-[6px] text-cyan-400/30 mb-2">
            WENDER MEDIA AGILE PRODUCTIVITY SUITE
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
          {count > 0 && (
            <div className="mt-2 text-[0.6rem] text-cyan-400/20">
              STANDUPS GENERATED: {count} — WORK DONE: 0
            </div>
          )}
        </header>

        <div className="text-center mb-8">
          <button
            onClick={generate}
            className="generate-btn bg-transparent border border-cyan-400 text-cyan-400 font-mono text-base py-4 px-12 cursor-pointer tracking-[4px]"
          >
            {'\u25B6'} GENERATE STANDUP
          </button>
          <div className="mt-3 text-[0.6rem] text-cyan-400/20 tracking-[2px]">
            CLICK UNTIL IT SOUNDS LIKE YOU
          </div>
        </div>

        {generated ? (
          <StandupOutput result={generated} onRegenerate={generate} />
        ) : (
          <div className="text-center py-8 text-cyan-400/15 text-[0.72rem] tracking-[3px]">
            <div className="text-4xl mb-4">{'\u{1F4CB}'}</div>
            <div>PRESS GENERATE TO SOUND PRODUCTIVE</div>
            <div className="text-[0.6rem] mt-2 text-cyan-400/[0.07]">
              NO ACTUAL WORK REQUIRED
            </div>
          </div>
        )}

        <footer className="border-t border-cyan-400/15 pt-6 mt-4 text-center text-[0.58rem] text-cyan-400/15 tracking-[2px] leading-9">
          <div>STANDUP GENERATOR IS NOT RESPONSIBLE FOR PERFORMANCE REVIEWS OR LAYOFFS</div>
          <div>BUILT BY WENDER MEDIA — OUR STANDUPS ARE ALSO GENERATED</div>
          <div className="text-red-500/15 mt-1">HTTP 418 — YOUR STANDUP IS A TEAPOT</div>
        </footer>
      </div>
    </div>
  );
}
