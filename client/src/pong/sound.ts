let ctx: AudioContext | null = null;

export function playPaddleSound(): void {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext };
    const win = window as WindowWithAudio;
    const AudioCtx = window.AudioContext || win.webkitAudioContext;
    if (!AudioCtx) return;
    ctx = new AudioCtx();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}
