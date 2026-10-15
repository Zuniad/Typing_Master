/**
 * Web Audio API Acoustic Synthesizer for Vintage Mechanical Typewriters.
 * Zero external audio file dependencies - 100% reliable, zero latency, works offline.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with autoplay policy
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Synthesize a standard typewriter key strike.
   * Multi-layered: metallic hammer impact, rubber platen thud, escapement ratchet click.
   */
  public playKeyStrike() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // Subtle pitch/filter variation for organic mechanical feel
    const pitchJitter = 0.94 + Math.random() * 0.12;

    // 1. Hammer metal strike transient (filtered noise impulse)
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2800 * pitchJitter, now);
    noiseFilter.Q.setValueAtTime(4.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(now);

    // 2. Platen cylinder rubber backing thud (low-frequency resonance)
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'triangle';
    thudOsc.frequency.setValueAtTime(160 * pitchJitter, now);
    thudOsc.frequency.exponentialRampToValueAtTime(50, now + 0.045);

    thudGain.gain.setValueAtTime(0.3, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    thudOsc.connect(thudGain);
    thudGain.connect(masterGain);
    thudOsc.start(now);
    thudOsc.stop(now + 0.05);

    // 3. Escapement ratchet click (high frequency metallic chirp)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(3600 * pitchJitter, now);
    clickOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.02);

    clickGain.gain.setValueAtTime(0.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.025);
  }

  /**
   * Synthesize spacebar clunk (heavier body resonance + ratchet advance).
   */
  public playSpacebar() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // Deep cast iron body thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.07);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.08);

    // Mechanical wood/metal click
    const clickNoise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
    const data = clickNoise.getChannelData(0);
    for (let i = 0; i < clickNoise.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = clickNoise;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.35, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noiseNode.connect(filter);
    filter.connect(clickGain);
    clickGain.connect(masterGain);
    noiseNode.start(now);
  }

  /**
   * Synthesize Enter key / carriage return.
   * Lever pull + carriage ratchet whir + solid carriage stop clack.
   */
  public playCarriageReturn() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // 1. Initial lever latch snap
    const leverOsc = ctx.createOscillator();
    const leverGain = ctx.createGain();
    leverOsc.type = 'triangle';
    leverOsc.frequency.setValueAtTime(1400, now);
    leverOsc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    leverGain.gain.setValueAtTime(0.4, now);
    leverGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    leverOsc.connect(leverGain);
    leverGain.connect(masterGain);
    leverOsc.start(now);
    leverOsc.stop(now + 0.05);

    // 2. Carriage ratchet whir (series of rapid light clicks)
    const clicksCount = 7;
    for (let i = 0; i < clicksCount; i++) {
      const clickTime = now + 0.04 + i * 0.024;
      const rOsc = ctx.createOscillator();
      const rGain = ctx.createGain();
      rOsc.type = 'square';
      rOsc.frequency.setValueAtTime(2200 + i * 80, clickTime);
      rGain.gain.setValueAtTime(0.12, clickTime);
      rGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.012);
      rOsc.connect(rGain);
      rGain.connect(masterGain);
      rOsc.start(clickTime);
      rOsc.stop(clickTime + 0.015);
    }

    // 3. Final firm bumper stop CLACK
    const stopTime = now + 0.22;
    const stopOsc = ctx.createOscillator();
    const stopGain = ctx.createGain();
    stopOsc.type = 'triangle';
    stopOsc.frequency.setValueAtTime(180, stopTime);
    stopOsc.frequency.exponentialRampToValueAtTime(50, stopTime + 0.08);
    stopGain.gain.setValueAtTime(0.55, stopTime);
    stopGain.gain.exponentialRampToValueAtTime(0.001, stopTime + 0.08);
    stopOsc.connect(stopGain);
    stopGain.connect(masterGain);
    stopOsc.start(stopTime);
    stopOsc.stop(stopTime + 0.09);
  }

  /**
   * Synthesize authentic vintage typewriter margin bell DING!
   * Pure acoustic brass bell with crystal chime and lingering resonance.
   */
  public playMarginBell() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.85, now);
    masterGain.connect(ctx.destination);

    // Fundamental chime (~2150 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2150, now);
    gain1.gain.setValueAtTime(0.45, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // First harmonic chime (~4300 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4300, now);
    gain2.gain.setValueAtTime(0.22, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now);
    osc2.stop(now + 0.6);

    // Initial hammer tap on brass
    const strike = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strike.type = 'triangle';
    strike.frequency.setValueAtTime(6200, now);
    strikeGain.gain.setValueAtTime(0.2, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    strike.connect(strikeGain);
    strikeGain.connect(masterGain);
    strike.start(now);
    strike.stop(now + 0.02);
  }

  /**
   * Backspace spring ratchet sound.
   */
  public playBackspace() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.7, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.035);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(2.5, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Shift key tension click.
   */
  public playShift() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.4, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.025);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Test complete celebration chime.
   */
  public playCelebration() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const chord = [1318.51, 1648.14, 1975.53, 2637.02]; // E6, G#6, B6, E7
    chord.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    });
  }
}

export const audioEngine = new AudioEngine();
