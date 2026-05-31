// ============================================================
// U&M Music AI — Constants
// ============================================================

export const APP_NAME = "U&M Music AI";
export const APP_TAGLINE = "Your AI Music Studio at Home.";
export const APP_DESCRIPTION = "Turn your raw voice into a studio-quality song. Record from home. Upload your vocals. Let AI clean, mix, master, and produce your music.";

export const GENRES = [
  "Bollywood Pop", "Indie Pop", "Acoustic", "R&B", "Hip Hop",
  "Classical", "Lo-fi", "EDM", "Rock", "Jazz", "Ghazal",
  "Sufi", "Folk", "Devotional", "K-Pop Style",
] as const;

export const MOODS = [
  "Happy", "Sad", "Romantic", "Energetic", "Calm",
  "Melancholic", "Dreamy", "Dark", "Motivational", "Nostalgic",
] as const;

export const LANGUAGES = [
  "Hindi", "English", "Punjabi", "Tamil", "Telugu",
  "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam",
  "Urdu", "Spanish", "Korean", "Japanese", "Other",
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

export const PROCESSING_STAGES = [
  { id: "noise", label: "Cleaning room noise", description: "Removing background interference" },
  { id: "clarity", label: "Enhancing vocal clarity", description: "Making your voice shine" },
  { id: "pitch", label: "Correcting pitch naturally", description: "Subtle tuning adjustments" },
  { id: "mix", label: "Building studio mix", description: "Blending all elements together" },
  { id: "master", label: "Mastering final sound", description: "Professional polish & loudness" },
  { id: "export", label: "Preparing export", description: "Getting your song ready" },
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
      "HD audio export",
      "AI mix & master",
      "Before/after comparison",
      "All mastering styles",
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
      "Unlimited basic projects",
      "WAV lossless export",
      "Voice DNA training",
      "Advanced AI mastering",
      "Release kit generator",
      "AI Vocal Coach",
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
      "Client project management",
      "Priority rendering",
      "Dedicated support",
      "API access",
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
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/create", label: "Create Song", icon: "PlusCircle" },
  { href: "/projects", label: "My Projects", icon: "FolderOpen" },
  { href: "/voice-dna", label: "Voice DNA", icon: "Dna" },
  { href: "/coach", label: "AI Vocal Coach", icon: "GraduationCap" },
  { href: "/pricing", label: "Pricing", icon: "CreditCard" },
  { href: "/support", label: "Support", icon: "HelpCircle" },
] as const;
