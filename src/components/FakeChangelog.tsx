/* ========================================
   Fake Changelog + Pro Tier — satirical
   changelog entries and a fake enterprise
   upgrade prompt
   ======================================== */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* --- Changelog entries organized by version --- */
interface ChangelogEntry {
  version: string;
  date: string;
  tag: 'major' | 'minor' | 'patch' | 'breaking';
  changes: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '6.6.6',
    date: '2026-04-04',
    tag: 'major',
    changes: [
      'Added Jira Board simulation (tickets are draggable, productivity is not)',
      'Slack Standup Bot now collects responses from fake team members',
      'Excuse Quality Metrics with Lighthouse-style believability scores',
      'CLI Mode renders standups as git log output',
      'Senior Dev Mode generates architecture-level excuses',
    ],
  },
  {
    version: '5.0.0',
    date: '2026-03-15',
    tag: 'major',
    changes: [
      'AI now detects when your manager is in the Zoom call',
      'Added "Blame the Build" preset for Mondays',
      'Standup Bingo now auto-marks phrases (the game plays itself, like your career)',
      'Speedrun Mode: generate a standup in 5 seconds or face accountability',
    ],
  },
  {
    version: '4.2.0',
    date: '2026-02-28',
    tag: 'minor',
    changes: [
      'Fixed bug where standup was accidentally productive',
      'Buzzword Singularity mode now includes Web3 terminology (for nostalgia)',
      'Added role: Intern (their standups are just questions)',
      'Share cards now 1200x630 for optimal social media engagement of your fake work',
    ],
  },
  {
    version: '4.0.0',
    date: '2026-01-10',
    tag: 'breaking',
    changes: [
      'BREAKING: Removed the "Actually Do Work" button (it was never clicked)',
      'Calendar now tracks days since last meaningful contribution',
      'Achievement system: collect badges for doing nothing effectively',
      'Easter eggs appear when you generate too many standups (HR has been notified)',
    ],
  },
  {
    version: '3.5.0',
    date: '2025-11-20',
    tag: 'minor',
    changes: [
      'Added confetti on every generation (dopamine engineering)',
      'Sound effects: drumroll before blockers, ding on completion',
      'CRT overlay for that retro "I\'ve been coding since before frameworks" aesthetic',
      'Typewriter effect makes it look like the standup is being composed in real-time',
    ],
  },
  {
    version: '3.0.0',
    date: '2025-09-01',
    tag: 'major',
    changes: [
      'Multi-role support: Frontend, Backend, DevOps, PM, Designer, Intern',
      'Blocker escalation: generates increasingly absurd blockers the more you click',
      'Copy to Slack: formatted with emoji for maximum passive-aggression',
      'Monday-specific moods (all depressing)',
    ],
  },
  {
    version: '2.0.0',
    date: '2025-06-15',
    tag: 'major',
    changes: [
      'Rewrote entire app in React (the irony is not lost on us)',
      'Added buzzword density slider (from Honest to Singularity)',
      'Dark theme: because standups happen before your eyes adjust',
      'Removed jQuery dependency. Yes, it was in there. No, we don\'t know why.',
    ],
  },
  {
    version: '1.0.0',
    date: '2025-03-01',
    tag: 'major',
    changes: [
      'Initial release: generates random standup updates',
      'One button. One purpose. Zero productivity.',
      'Built during an actual standup meeting',
    ],
  },
];

/* Version tag colors */
const TAG_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  major: { bg: 'rgba(136,46,224,0.15)', color: '#a78bfa', label: 'MAJOR' },
  minor: { bg: 'rgba(56,139,253,0.15)', color: '#58a6ff', label: 'MINOR' },
  patch: { bg: 'rgba(63,185,80,0.15)', color: '#3fb950', label: 'PATCH' },
  breaking: { bg: 'rgba(248,81,73,0.15)', color: '#f85149', label: 'BREAKING' },
};

/* --- Pro tier features --- */
const PRO_FEATURES = [
  'Auto-generates status updates from your git log (spoiler: it\'s all merge commits)',
  'AI-powered excuse optimization (learns from your manager\'s Slack patterns)',
  'Calendar integration: auto-joins standups, auto-generates updates, auto-leaves early',
  'Team analytics: see who generates the vaguest standups (leaderboard)',
  'Standup templates: "The Overachiever", "The Minimalist", "The Ghost"',
  'Priority override: mark all tasks as P0 with one click',
  'Meeting-to-standup converter: turns 1-hour meetings into 2-sentence updates',
  'Blame randomizer: automatically assigns blockers to team members not present',
];

export default function FakeChangelog() {
  const [showChangelog, setShowChangelog] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [proClicked, setProClicked] = useState(false);

  return (
    <div className="mb-8">
      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => { setShowChangelog(!showChangelog); setShowPro(false); }}
          className="flex-1 bg-transparent border font-mono text-[0.62rem] py-2.5 px-4 cursor-pointer tracking-[2px] transition-all"
          style={{
            borderColor: showChangelog ? '#00ffff' : 'rgba(0,255,255,0.15)',
            color: showChangelog ? '#00ffff' : 'rgba(0,255,255,0.35)',
            background: showChangelog ? 'rgba(0,255,255,0.05)' : 'transparent',
          }}
        >
          CHANGELOG
        </button>
        <button
          onClick={() => { setShowPro(!showPro); setShowChangelog(false); }}
          className="flex-1 font-mono text-[0.62rem] py-2.5 px-4 cursor-pointer tracking-[2px] transition-all border"
          style={{
            borderColor: showPro ? '#ffd700' : 'rgba(255,215,0,0.2)',
            color: showPro ? '#ffd700' : 'rgba(255,215,0,0.4)',
            background: showPro ? 'rgba(255,215,0,0.05)' : 'transparent',
          }}
        >
          PRO TIER
        </button>
      </div>

      {/* Changelog view */}
      <AnimatePresence>
        {showChangelog && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: 8,
                maxHeight: 500,
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #21262d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3', fontFamily: '-apple-system, sans-serif' }}>
                  Changelog
                </div>
                <div style={{ fontSize: 11, color: '#484f58', fontFamily: '-apple-system, sans-serif' }}>
                  All releases contain 0% actual features
                </div>
              </div>

              {/* Entries */}
              {CHANGELOG.map((entry, i) => {
                const tag = TAG_COLORS[entry.tag];
                return (
                  <motion.div
                    key={entry.version}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: i < CHANGELOG.length - 1 ? '1px solid #21262d' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3', fontFamily: 'monospace' }}>
                        v{entry.version}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 10,
                          background: tag.bg,
                          color: tag.color,
                          fontWeight: 600,
                          fontFamily: '-apple-system, sans-serif',
                        }}
                      >
                        {tag.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#484f58', fontFamily: '-apple-system, sans-serif' }}>
                        {entry.date}
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>
                      {entry.changes.map((change, ci) => (
                        <li
                          key={ci}
                          style={{
                            fontSize: 13,
                            color: '#8b949e',
                            lineHeight: 1.6,
                            fontFamily: '-apple-system, sans-serif',
                          }}
                        >
                          {change}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro tier view */}
      <AnimatePresence>
        {showPro && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #0d1117, #161b22)',
                border: '1px solid #ffd700',
                borderRadius: 8,
                padding: 24,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Gold gradient accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #ffd700, #ffaa00, #ffd700)',
                }}
              />

              {/* Pro badge */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{'\u{1F451}'}</div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#ffd700',
                    fontFamily: '-apple-system, sans-serif',
                    letterSpacing: 1,
                  }}
                >
                  Enterprise Standup Suite
                </div>
                <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4, fontFamily: '-apple-system, sans-serif' }}>
                  For teams that take not working very seriously
                </div>
              </div>

              {/* Features grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {PRO_FEATURES.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    style={{
                      fontSize: 12,
                      color: '#d1d2d3',
                      padding: '8px 10px',
                      background: 'rgba(255,215,0,0.03)',
                      border: '1px solid rgba(255,215,0,0.1)',
                      borderRadius: 6,
                      fontFamily: '-apple-system, sans-serif',
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: '#ffd700', marginRight: 6 }}>{'\u2713'}</span>
                    {feature}
                  </motion.div>
                ))}
              </div>

              {/* Pricing */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 14, color: '#484f58', textDecoration: 'line-through', fontFamily: '-apple-system, sans-serif' }}>
                    $49.99/mo
                  </span>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#ffd700', fontFamily: '-apple-system, sans-serif' }}>
                    $0.00
                  </span>
                  <span style={{ fontSize: 12, color: '#484f58', fontFamily: '-apple-system, sans-serif' }}>
                    /mo
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#484f58', fontFamily: '-apple-system, sans-serif' }}>
                  Because charging for fake standups felt wrong (our lawyers agreed)
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProClicked(true)}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: proClicked
                    ? 'transparent'
                    : 'linear-gradient(90deg, #ffd700, #ffaa00)',
                  border: proClicked ? '1px solid #ffd700' : 'none',
                  borderRadius: 6,
                  color: proClicked ? '#ffd700' : '#000',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, sans-serif',
                  letterSpacing: 1,
                }}
              >
                {proClicked
                  ? "You already have Pro. You always had Pro. There is no free tier."
                  : 'UPGRADE TO PRO'}
              </motion.button>

              {/* Trust badges */}
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 16,
                  fontSize: 10,
                  color: '#484f58',
                  fontFamily: '-apple-system, sans-serif',
                }}
              >
                <span>SOC 2 Compliant*</span>
                <span>GDPR Ready*</span>
                <span>ISO 27001*</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 8, color: '#30363d', marginTop: 4 }}>
                *None of these are real
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
