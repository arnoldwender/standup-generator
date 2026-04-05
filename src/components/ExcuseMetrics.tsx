/* ========================================
   Excuse Quality Metrics — Lighthouse-style
   scoring gauges for standup believability
   with jargon density, vagueness index, and
   Senior Dev Mode
   ======================================== */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  /** Combined standup text to analyze */
  standupText: string;
}

/* --- SVG circular gauge component (Lighthouse-style) --- */
function ScoreGauge({ score, label, size = 80 }: { score: number; label: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  /* Color based on score — green is good for excuses */
  const color =
    score >= 80 ? '#0cce6b' : score >= 50 ? '#ffa400' : '#ff4e42';
  const bgColor =
    score >= 80 ? 'rgba(12,206,107,0.1)' : score >= 50 ? 'rgba(255,164,0,0.1)' : 'rgba(255,78,66,0.1)';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill={bgColor}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={3}
          />
          {/* Score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        {/* Score number in center */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.3,
            fontWeight: 700,
            color,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.div>
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: '#999',
          marginTop: 6,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontFamily: '-apple-system, sans-serif',
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* --- Keyword scoring rules --- */
interface ScoringRule {
  keyword: string;
  points: number;
  label: string;
}

const JARGON_RULES: ScoringRule[] = [
  { keyword: 'pipeline', points: 15, label: 'Contains "pipeline": +15 pts' },
  { keyword: 'refactor', points: 20, label: 'Contains "refactoring": +20 pts (nobody questions refactoring)' },
  { keyword: 'architect', points: 18, label: 'Architecture terminology: +18 pts' },
  { keyword: 'synerg', points: 12, label: 'Contains "synergy": +12 pts' },
  { keyword: 'stakeholder', points: 14, label: 'Mentions stakeholders: +14 pts' },
  { keyword: 'align', points: 10, label: '"Alignment" detected: +10 pts' },
  { keyword: 'deep dive', points: 13, label: '"Deep dive" spotted: +13 pts' },
  { keyword: 'leverage', points: 11, label: 'Leverage leveraged: +11 pts' },
  { keyword: 'paradigm', points: 16, label: '"Paradigm" used unironically: +16 pts' },
  { keyword: 'blockchain', points: 8, label: '"Blockchain" mentioned: +8 pts (it\'s 2026, -2 credibility)' },
  { keyword: 'ai', points: 10, label: 'AI reference: +10 pts (mandatory in 2026)' },
  { keyword: 'sprint', points: 8, label: 'Sprint mentioned: +8 pts' },
  { keyword: 'scalab', points: 12, label: '"Scalable" detected: +12 pts' },
  { keyword: 'optimi', points: 9, label: 'Optimization language: +9 pts' },
  { keyword: 'cross-functional', points: 15, label: '"Cross-functional": +15 pts (maximum corporate)' },
  { keyword: 'migrate', points: 11, label: 'Migration mentioned: +11 pts' },
  { keyword: 'micro', points: 10, label: 'Microservices: +10 pts' },
  { keyword: 'monolith', points: 7, label: 'Monolith mentioned: +7 pts (implies deep knowledge)' },
  { keyword: 'kubernetes', points: 14, label: 'Kubernetes: +14 pts (instant credibility)' },
  { keyword: 'terraform', points: 13, label: 'Terraform: +13 pts (implies infrastructure wisdom)' },
];

const VAGUE_PATTERNS = [
  'investigate',
  'looking into',
  'working on',
  'continue',
  'ongoing',
  'in progress',
  'finalize',
  'wrap up',
  'address',
  'sync',
  'touch base',
  'circle back',
  'probably',
  'maybe',
  'should',
  'planning to',
  'going to',
  'hopefully',
  'theoretically',
  'allegedly',
];

const SENIOR_JARGON: ScoringRule[] = [
  { keyword: 'distributed system', points: 20, label: 'Distributed systems: +20 pts' },
  { keyword: 'eventual consistency', points: 22, label: 'Eventual consistency: +22 pts' },
  { keyword: 'cap theorem', points: 25, label: 'CAP theorem: +25 pts (instant senior)' },
  { keyword: 'idempoten', points: 18, label: 'Idempotency: +18 pts' },
  { keyword: 'observability', points: 16, label: 'Observability (not monitoring): +16 pts' },
  { keyword: 'circuit breaker', points: 17, label: 'Circuit breaker pattern: +17 pts' },
  { keyword: 'event sourcing', points: 19, label: 'Event sourcing: +19 pts' },
  { keyword: 'domain driven', points: 21, label: 'DDD terminology: +21 pts' },
];

export default function ExcuseMetrics({ standupText }: Props) {
  const [seniorMode, setSeniorMode] = useState(false);
  const [animated, setAnimated] = useState(false);

  /* Trigger animation on text change */
  useEffect(() => {
    if (standupText) {
      setAnimated(false);
      const t = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(t);
    }
  }, [standupText]);

  /* Calculate all scores */
  const analysis = useMemo(() => {
    if (!standupText) return null;
    const lower = standupText.toLowerCase();

    /* Jargon density */
    const rules = seniorMode ? [...JARGON_RULES, ...SENIOR_JARGON] : JARGON_RULES;
    const matchedRules: ScoringRule[] = [];
    let jargonScore = 30; // Base score for having any standup at all
    for (const rule of rules) {
      if (lower.includes(rule.keyword)) {
        matchedRules.push(rule);
        jargonScore += rule.points;
      }
    }
    jargonScore = Math.min(100, jargonScore);

    /* Vagueness index */
    let vagueCount = 0;
    for (const pattern of VAGUE_PATTERNS) {
      if (lower.includes(pattern)) vagueCount++;
    }
    const vagueScore = Math.min(100, 40 + vagueCount * 12);

    /* Overall believability — weighted average */
    const believability = Math.min(100, Math.round(jargonScore * 0.4 + vagueScore * 0.4 + (standupText.length > 80 ? 20 : standupText.length > 40 ? 10 : 0)));

    /* Confidence rating — how much it sounds like someone who actually did the work */
    const confidenceScore = Math.min(100, Math.round(
      (lower.includes('shipped') || lower.includes('deployed') || lower.includes('merged') ? 25 : 0)
      + (lower.includes('!') ? 5 : 0)
      + (matchedRules.length * 8)
      + 30,
    ));

    return {
      jargonScore,
      vagueScore,
      believability,
      confidenceScore,
      matchedRules,
      vagueCount,
    };
  }, [standupText, seniorMode]);

  if (!standupText) {
    return (
      <div
        className="mb-8"
        style={{
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: 8,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: '#484f58', fontFamily: '-apple-system, sans-serif' }}>
          Generate a standup to see your Excuse Quality Metrics
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header styled like Lighthouse report */}
      <div
        style={{
          background: '#0d1117',
          borderRadius: '8px 8px 0 0',
          padding: '16px 20px',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #30363d',
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3', fontFamily: '-apple-system, sans-serif' }}>
            Excuse Quality Report
          </div>
          <div style={{ fontSize: 11, color: '#484f58', marginTop: 2, fontFamily: '-apple-system, sans-serif' }}>
            Powered by StandupAI&trade; Believability Engine v4.2.0
          </div>
        </div>
        {/* Senior Dev Mode toggle */}
        <button
          onClick={() => setSeniorMode(!seniorMode)}
          style={{
            background: seniorMode ? 'rgba(136,46,224,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${seniorMode ? '#8b5cf6' : '#30363d'}`,
            color: seniorMode ? '#a78bfa' : '#484f58',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: '-apple-system, sans-serif',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          {seniorMode ? '\u2728 Senior Dev Mode ON' : 'Senior Dev Mode'}
        </button>
      </div>

      {/* Score gauges */}
      {animated && analysis && (
        <div
          style={{
            background: '#0d1117',
            padding: '24px 20px',
            borderLeft: '1px solid #30363d',
            borderRight: '1px solid #30363d',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <ScoreGauge score={analysis.jargonScore} label="Jargon Density" />
            <ScoreGauge score={analysis.vagueScore} label="Vagueness Index" />
            <ScoreGauge score={analysis.believability} label="Believability" />
            <ScoreGauge score={analysis.confidenceScore} label="Confidence" />
          </div>

          {/* Detailed breakdown */}
          <div style={{ marginTop: 20, borderTop: '1px solid #21262d', paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', marginBottom: 12, fontFamily: '-apple-system, sans-serif' }}>
              Scoring Breakdown
            </div>

            {/* Matched jargon rules */}
            {analysis.matchedRules.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {analysis.matchedRules.map((rule, i) => (
                  <motion.div
                    key={rule.keyword}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    style={{
                      fontSize: 12,
                      color: '#3fb950',
                      fontFamily: 'monospace',
                      padding: '4px 8px',
                      background: 'rgba(63,185,80,0.05)',
                      borderRadius: 4,
                    }}
                  >
                    {'\u2713'} {rule.label}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  fontSize: 12,
                  color: '#f85149',
                  fontFamily: 'monospace',
                  padding: '4px 8px',
                }}
              >
                {'\u2717'} No jargon detected. Your standup is suspiciously honest.
              </div>
            )}

            {/* Vagueness detail */}
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  color: analysis.vagueCount >= 3 ? '#3fb950' : '#f85149',
                  fontFamily: 'monospace',
                  padding: '4px 8px',
                }}
              >
                {analysis.vagueCount >= 3
                  ? `\u2713 Vagueness patterns found: ${analysis.vagueCount} (excellent obfuscation)`
                  : `\u2717 Only ${analysis.vagueCount} vague phrases. Be less specific.`}
              </div>
            </div>

            {/* Recommendations */}
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: 'rgba(56,139,253,0.05)',
                border: '1px solid rgba(56,139,253,0.2)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: '#58a6ff', marginBottom: 6, fontFamily: '-apple-system, sans-serif' }}>
                Recommendations
              </div>
              <div style={{ fontSize: 11, color: '#8b949e', lineHeight: 1.6, fontFamily: '-apple-system, sans-serif' }}>
                {analysis.believability < 60 && (
                  <div>{'\u2022'} Add more buzzwords. Try "pipeline", "refactoring", or "cross-functional".</div>
                )}
                {analysis.vagueScore < 60 && (
                  <div>{'\u2022'} Be vaguer. Replace specifics with "looking into" or "continuing work on".</div>
                )}
                {analysis.confidenceScore < 50 && (
                  <div>{'\u2022'} Sound more confident. Use "shipped" and "deployed" even if you didn't.</div>
                )}
                {analysis.believability >= 80 && (
                  <div>{'\u2022'} Your standup is virtually indistinguishable from a real one. Proceed with confidence.</div>
                )}
                {seniorMode && analysis.jargonScore < 70 && (
                  <div>{'\u2022'} Senior mode tip: mention "distributed systems" or "eventual consistency" for instant credibility.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          background: '#0d1117',
          borderRadius: '0 0 8px 8px',
          padding: '8px 20px',
          border: '1px solid #30363d',
          borderTop: 'none',
          fontSize: 10,
          color: '#484f58',
          fontFamily: '-apple-system, sans-serif',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Report generated in 0.{Math.floor(Math.random() * 900) + 100}s</span>
        <span>StandupAI Believability Engine</span>
      </div>
    </div>
  );
}
