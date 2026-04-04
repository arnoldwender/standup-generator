/* ========================================
   Standup Bingo — 5x5 card with common
   standup phrases, auto-marks matches
   ======================================== */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BINGO_PHRASES } from '../data/standup-data';
import { playAchievement } from '../hooks/useSound';

interface Props {
  /** Current standup text to scan for matches */
  standupText: string;
  onBingo: () => void;
}

/* Shuffle and pick 25 phrases for the card */
function generateCard(): string[] {
  const shuffled = [...BINGO_PHRASES].sort(() => Math.random() - 0.5);
  const card = shuffled.slice(0, 25);
  /* Center is FREE space */
  card[12] = 'FREE SPACE';
  return card;
}

/* Check all possible bingo lines */
function checkBingo(marked: Set<number>): number[] | null {
  const lines: number[][] = [];
  /* Rows */
  for (let r = 0; r < 5; r++) {
    lines.push([0, 1, 2, 3, 4].map((c) => r * 5 + c));
  }
  /* Columns */
  for (let c = 0; c < 5; c++) {
    lines.push([0, 1, 2, 3, 4].map((r) => r * 5 + c));
  }
  /* Diagonals */
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);

  for (const line of lines) {
    if (line.every((i) => marked.has(i))) return line;
  }
  return null;
}

export default function BingoCard({ standupText, onBingo }: Props) {
  const [card, setCard] = useState<string[]>(() => generateCard());
  const [marked, setMarked] = useState<Set<number>>(new Set([12])); // FREE
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [hasWon, setHasWon] = useState(false);

  /* Auto-mark phrases that appear in the standup text */
  useEffect(() => {
    if (!standupText) return;
    const lower = standupText.toLowerCase();
    setMarked((prev) => {
      const next = new Set(prev);
      card.forEach((phrase, i) => {
        if (phrase === 'FREE SPACE') return;
        /* Partial matching for flexibility */
        const words = phrase.toLowerCase().split(' ');
        const match = words.some((w) => w.length > 3 && lower.includes(w));
        if (match) next.add(i);
      });
      return next;
    });
  }, [standupText, card]);

  /* Check for bingo whenever marks change */
  useEffect(() => {
    if (hasWon) return;
    const line = checkBingo(marked);
    if (line) {
      setWinLine(line);
      setHasWon(true);
      onBingo();
      playAchievement();
      /* Gold confetti for bingo */
      confetti({
        particleCount: 150,
        spread: 100,
        colors: ['#ffd700', '#ffaa00', '#00ffff'],
        origin: { y: 0.6 },
      });
    }
  }, [marked, hasWon, onBingo]);

  /* Manual toggle */
  const toggle = useCallback(
    (index: number) => {
      if (index === 12) return; // FREE can't be untoggled
      setMarked((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    },
    [],
  );

  /* Reset card */
  const reset = () => {
    setCard(generateCard());
    setMarked(new Set([12]));
    setWinLine(null);
    setHasWon(false);
  };

  return (
    <div className="mb-6 border border-cyan-400/15 p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[0.6rem] tracking-[3px] text-cyan-400/40">
          STANDUP BINGO
        </span>
        <button
          onClick={reset}
          className="text-[0.5rem] tracking-[2px] text-cyan-400/25 hover:text-cyan-400/60 font-mono cursor-pointer bg-transparent border-none transition-colors"
        >
          NEW CARD
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {card.map((phrase, i) => {
          const isMarked = marked.has(i);
          const isWinCell = winLine?.includes(i);

          return (
            <motion.button
              key={`${phrase}-${i}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(i)}
              className="bingo-cell aspect-square flex items-center justify-center text-center p-1 cursor-pointer font-mono border transition-all duration-200"
              style={{
                fontSize: '0.42rem',
                lineHeight: '1.2',
                letterSpacing: '0.3px',
                background: isWinCell
                  ? 'rgba(255,215,0,0.2)'
                  : isMarked
                    ? 'rgba(0,255,255,0.12)'
                    : 'rgba(0,255,255,0.02)',
                borderColor: isWinCell
                  ? '#ffd700'
                  : isMarked
                    ? 'rgba(0,255,255,0.4)'
                    : 'rgba(0,255,255,0.08)',
                color: isWinCell
                  ? '#ffd700'
                  : isMarked
                    ? '#00ffff'
                    : 'rgba(0,255,255,0.3)',
              }}
            >
              {phrase}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {hasWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-[0.7rem] tracking-[4px] font-bold"
            style={{ color: '#ffd700', textShadow: '0 0 20px #ffd700' }}
          >
            BINGO! YOU WIN NOTHING!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
