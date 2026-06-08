/**
 * UANM Music AI — Model Router
 * Routes AI generation, cloning, separated stems, and mastering tasks.
 * Supports AI_MODE=mock and AI_MODE=production modes.
 */

export interface SongOutput {
  success: boolean;
  outputUrl?: string;
  metrics?: { qualityScore?: number; releaseQualityScore?: number; loudness?: number; noiseLevel?: number };
  details: Record<string, any>;
}

export interface AudioOutput {
  success: boolean;
  outputUrl?: string;
  details: Record<string, any>;
}

export interface VoiceModelOutput {
  success: boolean;
  metrics?: { similarityScore?: number; stabilityScore?: number; qualityScore?: number };
  details: Record<string, any>;
}

export interface StemOutput {
  success: boolean;
  stemsZipUrl?: string;
  details: Record<string, any>;
}

export interface MasterOutput {
  success: boolean;
  outputUrl?: string;
  metrics?: { loudness?: number };
  details: Record<string, any>;
}

export interface AudioAnalysisOutput {
  success: boolean;
  details: Record<string, any>;
}

export interface MusicAIProvider {
  name: string;
  generateSong(input: any): Promise<SongOutput>;
  generateInstrumental(input: any): Promise<AudioOutput>;
  rawVocalToSong(input: any): Promise<SongOutput>;
  trainVoice(input: any): Promise<VoiceModelOutput>;
  convertVoice(input: any): Promise<AudioOutput>;
  separateStems(input: any): Promise<StemOutput>;
  mixMaster(input: any): Promise<MasterOutput>;
  analyzeAudio(input: any): Promise<AudioAnalysisOutput>;
}

// ----------------------------------------------------------------------
// Mock Provider Implementation
// ----------------------------------------------------------------------

const DEMO_VOCAL = "https://kudivkkrmgraypstkgot.supabase.co/storage/v1/object/public/audio_uploads/demo-vocal.mp3";
const MOCK_MP3_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const MOCK_WAV_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
const MOCK_FLAC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
const MOCK_INST_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
const MOCK_VOCAL_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";

export class MockMusicAIProvider implements MusicAIProvider {
  name = "Mock Provider";

  private async simulateDelay() {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  async generateSong(input: any): Promise<SongOutput> {
    await this.simulateDelay();
    return {
      success: true,
      outputUrl: MOCK_MP3_URL,
      metrics: { qualityScore: 88.5, releaseQualityScore: 92.0, loudness: -14.0, noiseLevel: 12.3 },
      details: {
        bpm: input.bpm || 120,
        key: input.key || "C Major",
        duration: input.duration || 180,
        outputMp3Url: MOCK_MP3_URL,
        outputWavUrl: MOCK_WAV_URL,
        outputFlacUrl: MOCK_FLAC_URL,
        instrumentalUrl: MOCK_INST_URL,
        acapellaUrl: MOCK_VOCAL_URL,
        stemsZipUrl: MOCK_FLAC_URL,
        lyricsTxtUrl: DEMO_VOCAL,
        projectZipUrl: MOCK_WAV_URL,
        producerNotes: {
          title: `Generated Song`,
          selectedPreset: input.masteringStyle || "clean",
          vocalsFeedback: "AI Vocals rendered clearly."
        }
      }
    };
  }

  async generateInstrumental(input: any): Promise<AudioOutput> {
    await this.simulateDelay();
    return { success: true, outputUrl: MOCK_INST_URL, details: { action: "instrumental" } };
  }

  async rawVocalToSong(input: any): Promise<SongOutput> {
    return this.generateSong(input);
  }

  async trainVoice(input: any): Promise<VoiceModelOutput> {
    await this.simulateDelay();
    return {
      success: true,
      metrics: { similarityScore: 94.5, stabilityScore: 89.2, qualityScore: 91.0 },
      details: {
        datasetMinutes: input.datasetMinutes || 15.0,
        modelUrl: "/models/trained_voice_dna.bin",
        vocalRange: "E2 - G4",
        timbre: "Warm Baritone",
        languageAdaptability: ["Hindi", "English"],
      }
    };
  }

  async convertVoice(input: any): Promise<AudioOutput> {
    await this.simulateDelay();
    return { success: true, outputUrl: MOCK_VOCAL_URL, details: { action: "voice_converted" } };
  }

  async separateStems(input: any): Promise<StemOutput> {
    await this.simulateDelay();
    return { success: true, stemsZipUrl: MOCK_FLAC_URL, details: { stemsExtracted: 12 } };
  }

  async mixMaster(input: any): Promise<MasterOutput> {
    await this.simulateDelay();
    return {
      success: true,
      outputUrl: MOCK_WAV_URL,
      metrics: { loudness: -13.8 },
      details: { presetApplied: input.masteringStyle || "auto", limitingDb: -1.0 }
    };
  }

  async analyzeAudio(input: any): Promise<AudioAnalysisOutput> {
    await this.simulateDelay();
    return {
      success: true,
      details: {
        pitchAccuracy: 84.5,
        breathControl: 79.0,
        roomNoiseLevel: 32.5,
        tips: ["Practice vocal scales.", "Use soft blankets behind mic."]
      }
    };
  }
}

// ----------------------------------------------------------------------
// Production Provider Placeholder
// ----------------------------------------------------------------------

export class ReplicateMusicAIProvider implements MusicAIProvider {
  name = "Replicate / Meta AudioCraft / Demucs";

  // These would wrap actual API calls to Replicate
  async generateSong(input: any): Promise<SongOutput> { throw new Error("Not implemented"); }
  async generateInstrumental(input: any): Promise<AudioOutput> { throw new Error("Not implemented"); }
  async rawVocalToSong(input: any): Promise<SongOutput> { throw new Error("Not implemented"); }
  async trainVoice(input: any): Promise<VoiceModelOutput> { throw new Error("Not implemented"); }
  async convertVoice(input: any): Promise<AudioOutput> { throw new Error("Not implemented"); }
  async separateStems(input: any): Promise<StemOutput> { throw new Error("Not implemented"); }
  async mixMaster(input: any): Promise<MasterOutput> { throw new Error("Not implemented"); }
  async analyzeAudio(input: any): Promise<AudioAnalysisOutput> { throw new Error("Not implemented"); }
}

// ----------------------------------------------------------------------
// Router Factory
// ----------------------------------------------------------------------

export function getAIProvider(): MusicAIProvider {
  const mode = process.env.AI_MODE || "mock";
  if (mode === "production" && process.env.REPLICATE_API_TOKEN) {
    return new ReplicateMusicAIProvider();
  }
  return new MockMusicAIProvider();
}
