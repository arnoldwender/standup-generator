/* ========================================
   Standup Output — animated card display
   with typewriter effect, staggered reveals,
   Copy-to-Slack, and share card
   ======================================== */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { StandupResult } from '../data/standup-data';
import StandupCard from './StandupCard';
import ShareCard from './ShareCard';
import { playTypewriter, playDing } from '../hooks/useSound';

interface Props {
  result: StandupResult;
  onRegenerate: () => void;
  onShare: () => void;
  onCopy: () => void;
}

/* Stagger delay per section */
const STAGGER = 0.15;

/* Typewriter hook — reveals text character by character */
function useTypewriter(text: string, speed = 25, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          /* Play typewriter click every few characters */
          if (i % 3 === 0) playTypewriter();
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

export default function StandupOutput({ result, onRegenerate, onShare, onCopy }: Props) {
  const [copied, setCopied] = useState(false);

  /* Typewriter for each section */
  const y = useTypewriter(result.yesterday, 22, 200);
  const t = useTypewriter(result.today, 22, 600);
  const b = useTypewriter(result.blocker, 22, 1000);

  /* Play ding when all sections are revealed */
  useEffect(() => {
    if (y.done && t.done && b.done) {
      playDing();
    }
  }, [y.done, t.done, b.done]);

  /* Copy formatted for Slack with emoji */
  function copyToSlack() {
    const text = [
      `\u{1F519} *Yesterday:* ${result.yesterday}`,
      `\u{1F4C5} *Today:* ${result.today}`,
      `\u{1F6A7} *Blockers:* ${result.blocker}`,
      `\u{1F3AD} *Mood:* ${result.mood.emoji} ${result.mood.label}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onCopy();
      playDing();
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const cards = [
    { label: 'YESTERDAY', value: y.displayed, fullValue: result.yesterday, color: '#00ffff', delay: 0 },
    { label: 'TODAY', value: t.displayed, fullValue: result.today, color: '#00ff41', delay: STAGGER },
    { label: 'BLOCKERS', value: b.displayed, fullValue: result.blocker, color: '#ff0000', delay: STAGGER * 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mood display */}
      <motion.div
        className="text-center mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="text-5xl">{result.mood.emoji}</div>
        <div
          className="text-[0.6rem] tracking-[4px] mt-1"
          style={{ color: result.mood.color }}
        >
          TODAY'S MOOD: {result.mood.label}
        </div>
      </motion.div>

      {/* Staggered card reveals */}
      {cards.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * STAGGER, duration: 0.4, ease: 'easeOut' }}
        >
          <StandupCard
            label={item.label}
            value={item.value}
            color={item.color}
          />
        </motion.div>
      ))}

      {/* Paste-ready format */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="border border-cyan-900/20 bg-cyan-500/[0.02] p-4 mb-4 text-[0.7rem] leading-8 text-cyan-400/50"
      >
        <div className="text-[0.58rem] tracking-[3px] text-cyan-400/25 mb-2">
          SLACK-READY FORMAT:
        </div>
        <div>
          <span className="text-base mr-1">{"\u{1F519}"}</span>
          <strong className="text-cyan-400">Yesterday:</strong> {result.yesterday}
        </div>
        <div>
          <span className="text-base mr-1">{"\u{1F4C5}"}</span>
          <strong className="text-green-400">Today:</strong> {result.today}
        </div>
        <div>
          <span className="text-base mr-1">{"\u{1F6A7}"}</span>
          <strong className="text-red-500">Blockers:</strong> {result.blocker}
        </div>
        <div>
          <span className="text-base mr-1">{"\u{1F3AD}"}</span>
          <strong style={{ color: result.mood.color }}>Mood:</strong>{' '}
          {result.mood.emoji} {result.mood.label}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-2 mb-4"
      >
        <button
          onClick={copyToSlack}
          className="cbtn bg-transparent border border-cyan-400/25 font-mono text-[0.62rem] py-2.5 px-2 cursor-pointer tracking-[1px] transition-all"
          style={{ color: copied ? '#00ff41' : 'rgba(0,255,255,0.53)' }}
        >
          {copied ? '\u2713 COPIED' : 'COPY TO SLACK'}
        </button>
        <ShareCard result={result} onShare={onShare} />
        <button
          onClick={onRegenerate}
          className="cbtn bg-transparent border border-cyan-400/25 text-cyan-400/50 font-mono text-[0.62rem] py-2.5 px-2 cursor-pointer tracking-[1px] transition-all"
        >
          REGENERATE
        </button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border border-orange-400/10 bg-orange-400/[0.03] p-3 text-[0.6rem] text-orange-400/40 leading-7"
      >
        {'\u26A0'} DISCLAIMER: This standup was generated by an algorithm with 0 understanding of your actual work.
        It is indistinguishable from a real standup. This is not our fault. This is agile's fault.
      </motion.div>
    </motion.div>
  );
}
