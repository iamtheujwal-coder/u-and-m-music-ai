// ============================================================
// UANM Music AI — Audio Engine (Web Audio API Synthesis)
// Generates real audio buffers for different genres/moods
// ============================================================

export interface AudioGenOptions {
  genre?: string;
  bpm?: number;
  key?: string;
  duration?: number; // seconds
  mood?: string;
}

// Musical note frequencies (octave 4)
const NOTE_FREQS: Record<string, number> = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
  'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
  'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
};

// Chord patterns by mood
const CHORD_PROGRESSIONS: Record<string, number[][]> = {
  happy: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]],
  sad: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [0, 3, 7]],
  romantic: [[0, 4, 7, 11], [5, 9, 12, 16], [7, 11, 14, 17], [0, 4, 7, 11]],
  energetic: [[0, 4, 7], [3, 7, 10], [5, 9, 12], [7, 11, 14]],
  calm: [[0, 4, 7, 11], [2, 5, 9, 12], [4, 7, 11, 14], [0, 4, 7, 11]],
  dreamy: [[0, 4, 7, 11], [2, 6, 9, 14], [5, 9, 12, 16], [0, 4, 7, 11]],
  melancholic: [[0, 3, 7], [3, 7, 10], [5, 8, 12], [0, 3, 7]],
  dark: [[0, 3, 6], [1, 4, 7], [3, 6, 10], [0, 3, 6]],
  motivational: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]],
  nostalgic: [[0, 4, 7, 11], [5, 9, 12], [3, 7, 10], [0, 4, 7]],
};

// Drum pattern templates
const DRUM_PATTERNS: Record<string, { kick: number[]; snare: number[]; hihat: number[] }> = {
  pop: {
    kick: [0, 0.5, 0.75],
    snare: [0.25, 0.75],
    hihat: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
  },
  lofi: {
    kick: [0, 0.5],
    snare: [0.25, 0.75],
    hihat: [0, 0.25, 0.5, 0.75],
  },
  edm: {
    kick: [0, 0.25, 0.5, 0.75],
    snare: [0.25, 0.75],
    hihat: [0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375],
  },
  acoustic: {
    kick: [0, 0.5],
    snare: [0.25, 0.75],
    hihat: [0, 0.125, 0.25, 0.5, 0.625, 0.75],
  },
  bollywood: {
    kick: [0, 0.375, 0.5, 0.875],
    snare: [0.25, 0.75],
    hihat: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
  },
};

function getBaseFreq(key: string): number {
  const noteName = key.replace(' Major', '').replace(' Minor', '');
  return NOTE_FREQS[noteName] || 261.63;
}

function getDrumPattern(genre: string) {
  const g = genre.toLowerCase();
  if (g.includes('edm') || g.includes('electronic')) return DRUM_PATTERNS.edm;
  if (g.includes('lo-fi') || g.includes('lofi')) return DRUM_PATTERNS.lofi;
  if (g.includes('acoustic') || g.includes('folk')) return DRUM_PATTERNS.acoustic;
  if (g.includes('bollywood')) return DRUM_PATTERNS.bollywood;
  return DRUM_PATTERNS.pop;
}

function getChordProg(mood: string): number[][] {
  const m = mood.toLowerCase();
  return CHORD_PROGRESSIONS[m] || CHORD_PROGRESSIONS.happy;
}

/**
 * Generate a complete musical track using Web Audio API
 */
export async function generateTrack(options: AudioGenOptions = {}): Promise<AudioBuffer> {
  const {
    genre = 'Pop',
    bpm = 120,
    key = 'C Major',
    duration = 20,
    mood = 'Happy',
  } = options;

  const sampleRate = 44100;
  const totalSamples = sampleRate * duration;
  const ctx = new OfflineAudioContext(2, totalSamples, sampleRate);
  const beatDuration = 60 / bpm;
  const barDuration = beatDuration * 4;
  const totalBars = Math.ceil(duration / barDuration);
  const baseFreq = getBaseFreq(key);
  const isMinor = key.includes('Minor');
  const chords = getChordProg(mood);
  const drumPattern = getDrumPattern(genre);

  // ---- Bass Line ----
  for (let bar = 0; bar < totalBars; bar++) {
    const chord = chords[bar % chords.length];
    const bassFreq = baseFreq * Math.pow(2, chord[0] / 12) / 2;
    const startTime = bar * barDuration;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = bassFreq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + barDuration * 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + barDuration);
  }

  // ---- Chord Pads ----
  for (let bar = 0; bar < totalBars; bar++) {
    const chord = chords[bar % chords.length];
    const startTime = bar * barDuration;

    for (const semitone of chord) {
      const freq = baseFreq * Math.pow(2, semitone / 12);

      const osc = ctx.createOscillator();
      osc.type = genre.toLowerCase().includes('edm') ? 'sawtooth' : 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const padVol = genre.toLowerCase().includes('acoustic') ? 0.04 : 0.06;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(padVol, startTime + 0.1);
      gain.gain.setValueAtTime(padVol, startTime + barDuration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + barDuration * 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + barDuration);
    }
  }

  // ---- Melody Line ----
  const melodyNotes = isMinor
    ? [0, 2, 3, 5, 7, 8, 10, 12]
    : [0, 2, 4, 5, 7, 9, 11, 12];

  for (let bar = 0; bar < totalBars; bar++) {
    const notesPerBar = genre.toLowerCase().includes('edm') ? 8 : 4;
    const noteDur = barDuration / notesPerBar;

    for (let n = 0; n < notesPerBar; n++) {
      // Melodic pattern based on bar and note position
      const noteIdx = (bar * 3 + n * 2 + Math.floor(bar / 2)) % melodyNotes.length;
      const semitone = melodyNotes[noteIdx];
      const freq = baseFreq * 2 * Math.pow(2, semitone / 12); // octave up
      const startTime = bar * barDuration + n * noteDur;

      // Skip some notes for musical feel
      if ((n + bar) % 3 === 0 && n > 0) continue;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDur * 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDur);
    }
  }

  // ---- Drums ----
  for (let bar = 0; bar < totalBars; bar++) {
    const startTime = bar * barDuration;

    // Kick
    for (const pos of drumPattern.kick) {
      const t = startTime + pos * barDuration;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    // Snare (noise burst)
    for (const pos of drumPattern.snare) {
      const t = startTime + pos * barDuration;
      const bufferSize = sampleRate * 0.1;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.1);
    }

    // Hi-hat
    for (const pos of drumPattern.hihat) {
      const t = startTime + pos * barDuration;
      const bufferSize = sampleRate * 0.03;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 5000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.04);
    }
  }

  return ctx.startRendering();
}

/**
 * Generate only instrumental (no melody, emphasize chords + drums)
 */
export async function generateInstrumental(options: AudioGenOptions = {}): Promise<AudioBuffer> {
  // Reuse generateTrack but it's already mostly instrumental
  return generateTrack({ ...options, duration: options.duration || 20 });
}

/**
 * Generate an acapella-like vocal synth (simple sine melody)
 */
export async function generateAcapella(options: AudioGenOptions = {}): Promise<AudioBuffer> {
  const { bpm = 120, key = 'C Major', duration = 20 } = options;
  const sampleRate = 44100;
  const totalSamples = sampleRate * duration;
  const ctx = new OfflineAudioContext(2, totalSamples, sampleRate);
  const beatDuration = 60 / bpm;
  const barDuration = beatDuration * 4;
  const totalBars = Math.ceil(duration / barDuration);
  const baseFreq = getBaseFreq(key);
  const isMinor = key.includes('Minor');

  const scale = isMinor
    ? [0, 2, 3, 5, 7, 8, 10, 12]
    : [0, 2, 4, 5, 7, 9, 11, 12];

  for (let bar = 0; bar < totalBars; bar++) {
    const notesPerBar = 4;
    const noteDur = barDuration / notesPerBar;

    for (let n = 0; n < notesPerBar; n++) {
      const noteIdx = (bar * 3 + n * 2) % scale.length;
      const freq = baseFreq * 2 * Math.pow(2, scale[noteIdx] / 12);
      const startTime = bar * barDuration + n * noteDur;

      if ((n + bar) % 3 === 0 && n > 0) continue;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Add slight vibrato for vocal feel
      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 5;
      const vibratoGain = ctx.createGain();
      vibratoGain.gain.value = 3;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(startTime);
      vibrato.stop(startTime + noteDur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.setValueAtTime(0.15, startTime + noteDur * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDur * 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDur);
    }
  }

  return ctx.startRendering();
}

/**
 * Convert AudioBuffer to WAV Blob
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;
  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels and write samples
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Generate lyrics text based on parameters
 */
export function generateLyrics(title: string, genre: string, mood: string, language: string = 'English'): string {
  const moodLines: Record<string, string[]> = {
    happy: [
      "Dancing under golden lights",
      "Every moment feels so right",
      "We're alive, we're shining bright",
      "Nothing's gonna stop us tonight",
    ],
    sad: [
      "Echoes of a fading dream",
      "Nothing's ever what it seems",
      "Tears fall like a silent stream",
      "Lost between the dark and gleam",
    ],
    romantic: [
      "Your eyes hold a thousand stars",
      "Every beat of my heart is yours",
      "In your arms I found my world",
      "Love like this can't be unfurled",
    ],
    energetic: [
      "Turn it up, feel the bass drop",
      "We don't stop, we'll never stop",
      "Light it up, reach the rooftop",
      "This is our time, the countdown clock",
    ],
    calm: [
      "Gentle waves upon the shore",
      "Peaceful moments, nothing more",
      "Close your eyes, let yourself soar",
      "Find the quiet at your core",
    ],
    default: [
      "Words that carry through the night",
      "Melodies that feel so right",
      "Every note becomes our guide",
      "Music flowing deep inside",
    ],
  };

  const lines = moodLines[mood.toLowerCase()] || moodLines.default;

  return `${title}
by UANM Artist

Genre: ${genre} | Mood: ${mood} | Language: ${language}

[Verse 1]
${lines[0]}
${lines[1]}
The world around us starts to glow
As melodies begin to flow

[Pre-Chorus]
Can you feel it rising?
The rhythm never dies

[Chorus]
${lines[2]}
${lines[3]}
We're singing out our hearts tonight
${lines[0]}

[Verse 2]
The music takes us somewhere new
A symphony of every hue
${lines[1]}
Together we will make it through

[Bridge]
Oh, the sound of something real
This is how it's meant to feel
${lines[2]}
Every word we meant to say

[Chorus]
${lines[2]}
${lines[3]}
We're singing out our hearts tonight
${lines[0]}

[Outro]
${lines[3]}
(fade out)

---
Generated by UANM Music AI
`;
}
