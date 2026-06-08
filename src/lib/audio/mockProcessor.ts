// ============================================================
// UANM Music AI — Mock Processor (Client-side audio generation)
// Replaces external API calls with local Web Audio generation
// ============================================================

import { generateTrack, generateInstrumental, generateAcapella, generateLyrics, audioBufferToWav } from "./audioEngine";
import { updateProject } from "../demoStore";

export interface ProcessingOptions {
  projectId: string;
  genre: string;
  mood: string;
  bpm: number;
  keySignature: string;
  duration: number;
  mode: string;
  onProgress: (progress: number, stageIndex: number) => void;
  onComplete: (urls: { [key: string]: string }) => void;
  onError: (error: Error) => void;
}

const STAGES = [
  "Analyzing input data",
  "Composing melody & chords",
  "Arranging instrumentation",
  "Synthesizing audio layers",
  "Mixing and applying effects",
  "Final mastering polish",
];

export async function processProjectLocally(options: ProcessingOptions) {
  const { projectId, genre, mood, bpm, keySignature, duration, mode, onProgress, onComplete, onError } = options;

  try {
    // 1. Simulate analysis (Progress 0-20%)
    let currentStage = 0;
    for (let p = 0; p <= 20; p += 5) {
      onProgress(p, currentStage);
      await new Promise(r => setTimeout(r, 200));
    }

    // 2. Composing (Progress 20-40%)
    currentStage = 1;
    onProgress(20, currentStage);
    
    // Generate lyrics
    const title = "UANM Masterpiece";
    const lyricsText = generateLyrics(title, genre, mood);
    const lyricsBlob = new Blob([lyricsText], { type: "text/plain" });
    const lyricsUrl = URL.createObjectURL(lyricsBlob);
    
    for (let p = 25; p <= 40; p += 5) {
      onProgress(p, currentStage);
      await new Promise(r => setTimeout(r, 200));
    }

    // 3. Arrangement & Synthesis (Progress 40-70%)
    currentStage = 2;
    onProgress(40, currentStage);
    
    // Generate actual audio using Web Audio API!
    // We generate main track, instrumental, and acapella
    const trackBuffer = await generateTrack({ genre, mood, bpm, key: keySignature, duration });
    
    currentStage = 3;
    onProgress(60, currentStage);
    
    const instBuffer = await generateInstrumental({ genre, mood, bpm, key: keySignature, duration });
    const acapellaBuffer = await generateAcapella({ bpm, key: keySignature, duration });

    // 4. Mixing & Converting to Blobs (Progress 70-90%)
    currentStage = 4;
    onProgress(70, currentStage);
    
    const trackBlob = audioBufferToWav(trackBuffer);
    const trackUrl = URL.createObjectURL(trackBlob);
    
    const instBlob = audioBufferToWav(instBuffer);
    const instUrl = URL.createObjectURL(instBlob);
    
    const acapellaBlob = audioBufferToWav(acapellaBuffer);
    const acapellaUrl = URL.createObjectURL(acapellaBlob);

    // 5. Finalize (Progress 90-100%)
    currentStage = 5;
    for (let p = 80; p <= 100; p += 10) {
      onProgress(p, currentStage);
      await new Promise(r => setTimeout(r, 200));
    }

    // Create a mock stems zip and project zip by just reusing the track URL
    // In a real app we'd use JSZip, but Blob URLs for WAV are fine for the mock
    const urls = {
      output_file_url: trackUrl,
      output_mp3_url: trackUrl,
      output_wav_url: trackUrl,
      output_flac_url: trackUrl, // fallback
      instrumental_url: instUrl,
      acapella_url: acapellaUrl,
      lyrics_txt_url: lyricsUrl,
      stems_zip_url: trackUrl,
      project_zip_url: trackUrl,
    };

    // Update demo store if it's a demo project
    try {
      updateProject(projectId, {
        status: "completed",
        output_file_url: trackUrl,
        audio_blobs: urls,
      });
    } catch (e) {
      // It's okay if update fails (might be supabase project)
    }

    onComplete(urls);

  } catch (error: any) {
    console.error("Local processing error:", error);
    onError(error);
  }
}
