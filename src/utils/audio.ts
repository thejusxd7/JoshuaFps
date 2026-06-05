// Web Audio API Synthesized Sound Effects for a Premium Tactile Experience
// Lazy-initialized on first user gesture to comply with browser autoplay policies

let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Soft Hover Blip (Rising elegant frequency)
export function playHoverSound(enabled: boolean) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Gentle high pitch sweep
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn("Audio Context block or error:", e);
  }
}

// 2. High-Tech Click Snap
export function playClickSound(enabled: boolean) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    console.warn("Audio Context block or error:", e);
  }
}

// 3. Cherry Chime (Harmonic Success chord)
export function playChimeSound(enabled: boolean) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.03 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.3);
    });
  } catch (e) {
    console.warn("Audio Context block or error:", e);
  }
}

// 4. Low-Frequency Warm Ambient Red Drone (Synthesizer hum)
export function startAmbientDrone(enabled: boolean) {
  if (!enabled) {
    stopAmbientDrone();
    return;
  }
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ambientOsc1) return; // Already running

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.0, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5); // Smooth fade in

    // Base Oscillator (Low warm C)
    ambientOsc1 = ctx.createOscillator();
    ambientOsc1.type = "triangle";
    ambientOsc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2

    // Detuned second oscillator for lush thickness
    ambientOsc2 = ctx.createOscillator();
    ambientOsc2.type = "sine";
    ambientOsc2.frequency.setValueAtTime(65.71, ctx.currentTime); // Slight detune (~8 cents)

    // Connect them
    ambientOsc1.connect(ambientGain);
    ambientOsc2.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch (e) {
    console.warn("Ambient Audio Drone error:", e);
  }
}

export function stopAmbientDrone() {
  const ctx = getAudioContext();
  if (ambientGain && ctx) {
    try {
      const g = ambientGain;
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5); // Smooth fade out
      
      const o1 = ambientOsc1;
      const o2 = ambientOsc2;
      
      setTimeout(() => {
        try {
          if (o1) o1.stop();
          if (o2) o2.stop();
        } catch (e) {}
      }, 500);
    } catch (e) {}
  }
  ambientOsc1 = null;
  ambientOsc2 = null;
  ambientGain = null;
}
