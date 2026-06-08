// ============================================================
// UANM Music AI — Constants (Complete Platform)
// ============================================================

export const APP_NAME = "UANM Music AI";
export const APP_TAGLINE = "Professional Sound From Home.";
export const APP_DESCRIPTION = "The complete AI operating system for singers, artists, and music creators. Upload vocals, train your voice, create songs, master tracks, and grow your audience — all from home.";

export const GENRES = [
  "Bollywood Pop", "Indie Pop", "Acoustic", "R&B", "Hip Hop",
  "Classical", "Lo-fi", "EDM", "Rock", "Jazz", "Ghazal",
  "Sufi", "Folk", "Devotional", "K-Pop Style",
] as const;

export const COMPOSER_GENRES = [
  "Bollywood", "Pop", "Rock", "EDM", "Hip Hop",
  "Lo-fi", "Acoustic", "Classical", "Assamese", "Regional",
  "R&B", "Jazz", "Indie", "Folk", "Sufi",
] as const;

export const MOODS = [
  "Happy", "Sad", "Romantic", "Energetic", "Calm",
  "Melancholic", "Dreamy", "Dark", "Motivational", "Nostalgic",
] as const;

export const LANGUAGES = [
  "Hindi", "English", "Punjabi", "Tamil", "Telugu",
  "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam",
  "Urdu", "Spanish", "Korean", "Japanese", "Assamese", "Other",
] as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", description: "I sing for fun, just starting out" },
  { value: "intermediate", label: "Intermediate", description: "I can sing well, want to improve" },
  { value: "advanced", label: "Advanced", description: "I perform regularly, need pro tools" },
  { value: "professional", label: "Professional", description: "I'm a working artist / producer" },
] as const;

export const MAIN_GOALS = [
  { value: "covers", label: "Cover Songs", icon: "🎤", description: "Record professional covers of songs I love" },
  { value: "originals", label: "Original Songs", icon: "✨", description: "Create and produce my own original music" },
  { value: "improvement", label: "Voice Improvement", icon: "📈", description: "Analyze and improve my singing skills" },
  { value: "ai_generation", label: "AI Music Generation", icon: "🤖", description: "Generate music and instrumentals with AI" },
  { value: "mastering", label: "Professional Mastering", icon: "🎧", description: "Master my tracks for release on platforms" },
] as const;

export const MASTERING_STYLES = [
  { value: "warm", label: "Warm", description: "Rich, analog warmth" },
  { value: "clean", label: "Clean", description: "Crystal clear modern sound" },
  { value: "bollywood_pop", label: "Bollywood Pop", description: "Radio-ready Bollywood sound" },
  { value: "indie_acoustic", label: "Indie Acoustic", description: "Natural, intimate feel" },
  { value: "lofi", label: "Lo-fi", description: "Vintage, textured vibes" },
  { value: "commercial_loud", label: "Commercial Loud", description: "Maximum impact loudness" },
  { value: "natural_vocal", label: "Natural Vocal", description: "Voice-forward, minimal processing" },
] as const;

export const PLATFORM_PRESETS = [
  { value: "spotify", label: "Spotify", icon: "🎵", lufs: -14, description: "Integrated loudness -14 LUFS" },
  { value: "youtube", label: "YouTube", icon: "📺", lufs: -14, description: "Normalized to -14 LUFS" },
  { value: "instagram", label: "Instagram", icon: "📱", lufs: -14, description: "Short-form optimized" },
  { value: "apple_music", label: "Apple Music", icon: "🍎", lufs: -16, description: "Sound Check at -16 LUFS" },
  { value: "radio", label: "Radio", icon: "📻", lufs: -9, description: "Broadcast ready -9 LUFS" },
  { value: "bollywood", label: "Bollywood", icon: "🎬", lufs: -11, description: "Industry standard" },
  { value: "indie", label: "Indie", icon: "🎸", lufs: -14, description: "Organic dynamics" },
  { value: "lofi", label: "Lo-fi", icon: "☕", lufs: -16, description: "Warm & relaxed" },
  { value: "acoustic", label: "Acoustic", icon: "🪕", lufs: -18, description: "Maximum dynamics" },
] as const;

export const EXPORT_FORMATS = [
  { value: "mp3", label: "MP3", description: "Compressed, universal compatibility", bitrate: "320kbps" },
  { value: "wav", label: "WAV", description: "Lossless, studio quality", bitrate: "24-bit/48kHz" },
  { value: "flac", label: "FLAC", description: "Lossless compressed, audiophile grade", bitrate: "24-bit" },
] as const;

export const STUDIO_EFFECTS = [
  { id: "noise_removal", label: "Noise Removal", description: "Remove background noise", icon: "🔇", category: "cleanup" },
  { id: "echo_removal", label: "Echo Removal", description: "Remove room echo & reverb", icon: "🏠", category: "cleanup" },
  { id: "breath_cleanup", label: "Breath Cleanup", description: "Reduce breath sounds", icon: "💨", category: "cleanup" },
  { id: "pitch_correction", label: "Pitch Correction", description: "Natural pitch alignment", icon: "🎯", category: "tuning" },
  { id: "auto_tune", label: "Auto-Tune", description: "Signature vocal effect", icon: "🤖", category: "tuning" },
  { id: "vocal_enhancement", label: "Vocal Enhancement", description: "Presence & brightness boost", icon: "✨", category: "enhance" },
  { id: "vocal_thickening", label: "Vocal Thickening", description: "Add body & fullness", icon: "🎤", category: "enhance" },
  { id: "harmony_generation", label: "Harmony Generation", description: "AI-generated harmonies", icon: "🎶", category: "creative" },
  { id: "double_tracking", label: "Double Tracking", description: "Realistic vocal doubling", icon: "👥", category: "creative" },
  { id: "smart_eq", label: "Smart EQ", description: "Intelligent frequency sculpting", icon: "📊", category: "mix" },
  { id: "smart_compression", label: "Smart Compression", description: "Dynamic range control", icon: "📈", category: "mix" },
  { id: "ai_mixing", label: "AI Mixing", description: "Automatic level balancing", icon: "🎛️", category: "mix" },
  { id: "ai_mastering", label: "AI Mastering", description: "Final polish & loudness", icon: "💎", category: "master" },
] as const;

export const VOICE_ANALYSIS_METRICS = [
  { key: "vocal_range", label: "Vocal Range", icon: "📏", description: "Total singing range in octaves" },
  { key: "timbre", label: "Timbre", icon: "🎨", description: "Tonal color & texture" },
  { key: "vibrato", label: "Vibrato", icon: "〰️", description: "Natural vibrato strength" },
  { key: "vocal_strength", label: "Vocal Strength", icon: "💪", description: "Power & projection" },
  { key: "emotional_style", label: "Emotional Style", icon: "❤️", description: "Emotional expressiveness" },
  { key: "language_adaptability", label: "Language Adaptability", icon: "🌍", description: "Multi-language capability" },
  { key: "singing_consistency", label: "Singing Consistency", icon: "🎯", description: "Performance reliability" },
] as const;

export const TRAINING_LEVELS = [
  { value: "starter", label: "Starter", audio: "15–30 min", description: "Basic voice clone", samples: "5–10 samples" },
  { value: "pro", label: "Pro", audio: "1–2 hours", description: "High-fidelity clone", samples: "15–30 samples" },
  { value: "studio_level", label: "Studio", audio: "5+ hours", description: "Professional-grade model", samples: "50+ samples" },
] as const;

export const PROCESSING_STAGES = [
  { id: "noise", label: "Cleaning room noise", description: "Removing background interference" },
  { id: "clarity", label: "Enhancing vocal clarity", description: "Making your voice shine" },
  { id: "pitch", label: "Correcting pitch naturally", description: "Subtle tuning adjustments" },
  { id: "mix", label: "Building studio mix", description: "Blending all elements together" },
  { id: "master", label: "Mastering final sound", description: "Professional polish & loudness" },
  { id: "export", label: "Preparing export", description: "Getting your song ready" },
] as const;

export const SONG_STRUCTURES = [
  "Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro",
  "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
  "Intro-Verse-Pre-Chorus-Chorus-Verse-Chorus",
  "Verse-Verse-Bridge-Verse",
  "AABA (Standard)",
  "Intro-Hook-Verse-Hook-Outro",
] as const;

export const KEY_SIGNATURES = [
  "C Major", "C Minor", "C# Major", "C# Minor",
  "D Major", "D Minor", "D# Major", "D# Minor",
  "E Major", "E Minor", "F Major", "F Minor",
  "F# Major", "F# Minor", "G Major", "G Minor",
  "G# Major", "G# Minor", "A Major", "A Minor",
  "A# Major", "A# Minor", "B Major", "B Minor",
] as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "₹",
    period: "forever",
    description: "Get started with AI music",
    features: [
      "2 projects per month",
      "Basic vocal cleanup",
      "MP3 export",
      "AI Vocal Coach (basic)",
      "Community support",
    ],
    highlighted: false,
    cta: "Start Free",
  },
  {
    id: "creator",
    name: "Creator",
    price: 299,
    currency: "₹",
    period: "month",
    description: "For growing singers",
    features: [
      "20 projects per month",
      "HD audio export (WAV)",
      "AI mix & master",
      "Before/after comparison",
      "All mastering styles",
      "Cover Studio access",
      "Email support",
    ],
    highlighted: false,
    cta: "Upgrade to Creator",
  },
  {
    id: "pro_artist",
    name: "Pro Artist",
    price: 999,
    currency: "₹",
    period: "month",
    description: "For serious artists",
    features: [
      "Unlimited projects",
      "WAV + FLAC lossless export",
      "Voice DNA training",
      "Advanced AI mastering",
      "UANM Studio (all effects)",
      "Composer & Dream Song Engine",
      "AI Producer feedback",
      "Release Kit generator",
      "AI Vocal Coach (full)",
      "Career OS analytics",
      "Priority support",
    ],
    highlighted: true,
    cta: "Go Pro",
  },
  {
    id: "studio",
    name: "Studio",
    price: 2999,
    currency: "₹",
    period: "month",
    description: "For teams & studios",
    features: [
      "Everything in Pro",
      "Team access (5 seats)",
      "Bulk processing",
      "Collaboration hub",
      "Client project management",
      "Priority rendering",
      "Dedicated support",
      "API access",
    ],
    highlighted: false,
    cta: "Get Studio",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0,
    currency: "₹",
    period: "custom",
    description: "For labels & organizations",
    features: [
      "Everything in Studio",
      "Unlimited seats",
      "Custom voice models",
      "White-label option",
      "SLA guarantee",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
] as const;

export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/flac",
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const TICKET_CATEGORIES = [
  { value: "payment", label: "Payment Issue" },
  { value: "audio_processing", label: "Audio Processing Issue" },
  { value: "output_quality", label: "Output Quality Issue" },
  { value: "copyright", label: "Copyright / Rights Issue" },
  { value: "account", label: "Account Issue" },
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", section: "main" },
  { href: "/create", label: "Create Song", icon: "PlusCircle", section: "core" },
  { href: "/studio", label: "Mix & Master", icon: "Sliders", section: "core" },
  { href: "/composer", label: "Composer", icon: "Music", section: "core" },
  { href: "/projects", label: "My Projects", icon: "FolderOpen", section: "core" },
  { href: "/voice-dna", label: "Voice DNA", icon: "Dna", section: "core" },
  { href: "/downloads", label: "Downloads", icon: "Download", section: "core" },
  { href: "/pricing", label: "Pricing", icon: "CreditCard", section: "other" },
  { href: "/support", label: "Support", icon: "HelpCircle", section: "other" },
] as const;

export const NAV_SECTIONS = [
  { id: "main", label: "" },
  { id: "core", label: "Core MVP" },
  { id: "other", label: "" },
] as const;

