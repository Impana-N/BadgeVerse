/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio synthesizer - zero external audio assets to prevent 404s
class AudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Disabled by default per project requirements
    this.isEnabled = false;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled && !this.ctx) {
      this.initContext();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  private initContext() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch {
      // AudioContext not supported
      this.ctx = null;
    }
  }

  private ensureContext() {
    if (!this.ctx) {
      this.initContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Subtle glassy tap for interactive choices
   */
  public playTap() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Dreamy celestial chime when selecting a quiz option
   */
  public playSelectChime() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const startTime = now + idx * 0.04;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  /**
   * Resonant harmonic chord for archetype reveal
   */
  public playRevealChord() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chord = [329.63, 440.0, 554.37, 659.25, 880.0]; // E major 9th spread
    const now = this.ctx.currentTime;

    chord.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const noteDelay = i * 0.06;
      const startTime = now + noteDelay;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });
  }

  /**
   * Shimmering harp arpeggio when badge is generated
   */
  public playBadgeGenerated() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const now = this.ctx.currentTime;

    arpeggio.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      const startTime = now + i * 0.07;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.75);
    });
  }
}

export const soundFx = new AudioManager();
