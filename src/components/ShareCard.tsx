/* ========================================
   Share Card — generates a styled image
   of the standup, mimicking a Slack message
   ======================================== */

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import type { StandupResult } from '../data/standup-data';

interface Props {
  result: StandupResult;
  onShare: () => void;
}

export default function ShareCard({ result, onShare }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  async function generateImage() {
    if (!cardRef.current) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      });

      /* Download the image */
      const link = document.createElement('a');
      link.download = 'standup-generator.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      onShare();
    } catch (err) {
      console.error('Share card generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      {/* Hidden card for rendering — styled like a Slack message */}
      <div className="overflow-hidden h-0">
        <div
          ref={cardRef}
          style={{
            width: 600,
            padding: 32,
            background: '#1a1a2e',
            fontFamily: 'monospace',
            color: '#e0e0e0',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#00ffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              {result.mood.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 14, color: '#00ffff' }}>
                Standup Generator
              </div>
              <div style={{ fontSize: 11, color: '#666' }}>
                Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div style={{ borderLeft: '3px solid #00ffff', paddingLeft: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>YESTERDAY</div>
            <div style={{ fontSize: 14, color: '#00ffff' }}>{result.yesterday}</div>
          </div>

          <div style={{ borderLeft: '3px solid #00ff41', paddingLeft: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>TODAY</div>
            <div style={{ fontSize: 14, color: '#00ff41' }}>{result.today}</div>
          </div>

          <div style={{ borderLeft: '3px solid #ff4444', paddingLeft: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>BLOCKERS</div>
            <div style={{ fontSize: 14, color: '#ff4444' }}>{result.blocker}</div>
          </div>

          <div style={{ borderLeft: '3px solid ' + result.mood.color, paddingLeft: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>MOOD</div>
            <div style={{ fontSize: 14, color: result.mood.color }}>
              {result.mood.emoji} {result.mood.label}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: '1px solid #333',
              paddingTop: 12,
              fontSize: 10,
              color: '#555',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>STANDUP GENERATOR v6.6.6</span>
            <span>SOUND BUSY. DO NOTHING.</span>
          </div>
        </div>
      </div>

      {/* Download button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateImage}
        disabled={generating}
        className="w-full bg-transparent border border-purple-400/25 text-purple-400/60 font-mono text-[0.65rem] py-2.5 px-3 cursor-pointer tracking-[2px] hover:bg-purple-400/10 transition-all disabled:opacity-30"
      >
        {generating ? 'GENERATING...' : 'DOWNLOAD SHARE CARD'}
      </motion.button>
    </div>
  );
}
