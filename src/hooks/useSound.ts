/* ========================================
   Web Audio API sound effects
   Generates all sounds programmatically —
   no external audio files needed
   ======================================== */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/* Typewriter click — short noise burst */
export function playTypewriter() {
  const ctx = getCtx();
  const duration = 0.03;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.value = 0.15;

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

/* Slack-style notification ding */
export function playDing() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

/* Dramatic drumroll — low rumble before blocker reveal */
export function playDrumroll(): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getCtx();
    const duration = 0.8;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    /* Rapid bursts simulating a drumroll */
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      const burstRate = 20 + t * 40; // accelerating
      const burst = Math.sin(t * burstRate * Math.PI * 2) > 0.3 ? 1 : 0;
      data[i] = (Math.random() * 2 - 1) * burst * (0.1 + t * 0.15);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = ctx.createGain();
    gain.gain.value = 0.25;

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    source.onended = () => resolve();
  });
}

/* Achievement unlock sound — ascending tones */
export function playAchievement() {
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.1;

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  });
}

/* Countdown tick */
export function playTick() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

/* Speedrun complete fanfare */
export function playFanfare() {
  const ctx = getCtx();
  const melody = [523, 659, 784, 1047, 784, 1047, 1319];

  melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.12;

    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.25);
  });
}
