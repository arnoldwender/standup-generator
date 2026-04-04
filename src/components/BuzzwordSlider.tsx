/* ========================================
   Buzzword Density Slider — controls how
   much corporate speak infects the standup
   ======================================== */

import { motion } from 'framer-motion';
import type { BuzzwordLevel } from '../data/standup-data';
import { BUZZWORD_LABELS } from '../data/standup-data';

const LEVELS: BuzzwordLevel[] = ['honest', 'middle-management', 'c-suite', 'singularity'];

interface Props {
  level: BuzzwordLevel;
  onChange: (level: BuzzwordLevel) => void;
}

export default function BuzzwordSlider({ level, onChange }: Props) {
  const currentIndex = LEVELS.indexOf(level);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[0.6rem] tracking-[3px] text-cyan-400/40">
          BUZZWORD DENSITY
        </label>
        <motion.span
          key={level}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[0.65rem] tracking-[2px] text-cyan-400/70"
        >
          {BUZZWORD_LABELS[level]}
        </motion.span>
      </div>

      <input
        type="range"
        min={0}
        max={3}
        value={currentIndex}
        onChange={(e) => onChange(LEVELS[parseInt(e.target.value)])}
        className="buzzword-slider w-full"
      />

      <div className="flex justify-between mt-1">
        {LEVELS.map((l) => (
          <span
            key={l}
            className="text-[0.5rem] tracking-[1px] transition-colors duration-200"
            style={{ color: l === level ? '#00ffff' : 'rgba(0,255,255,0.15)' }}
          >
            {BUZZWORD_LABELS[l].split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
