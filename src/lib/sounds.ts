"use client";

let audioCtx: AudioContext | null = null;
let enabled = false;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (value) {
    // Ensure audio context is resumed (browser autoplay policy)
    getContext().resume();
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function playKeystroke() {
  if (!enabled) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";
  osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

export function playBeep() {
  if (!enabled) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

export function playBootBeep() {
  if (!enabled) return;
  const ctx = getContext();

  // Classic POST beep
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

export function playError() {
  if (!enabled) return;
  const ctx = getContext();

  // Two-tone error beep
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.setValueAtTime(300, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}
