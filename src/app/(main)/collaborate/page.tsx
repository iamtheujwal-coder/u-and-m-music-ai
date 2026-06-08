"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Music, Star, MapPin, Send, Check, X,
  UserPlus, MessageSquare, Filter, ChevronDown
} from "lucide-react";
import { GENRES } from "@/lib/constants";

const DEMO_ARTISTS = [
  { id: "1", display_name: "Aarav Sharma", bio: "Singer-songwriter from Mumbai. Bollywood pop & indie vibes.", genres: ["Bollywood Pop", "Indie Pop"], skills: ["Vocalist", "Lyricist"], looking_for: ["Producer", "Guitarist"], avatar_url: null, sample_url: null },
  { id: "2", display_name: "Priya Nair", bio: "Classical-trained vocalist exploring fusion. Tamil & Hindi.", genres: ["Classical", "Folk", "Acoustic"], skills: ["Vocalist", "Composer"], looking_for: ["Mixing Engineer", "Tabla Player"], avatar_url: null, sample_url: null },
  { id: "3", display_name: "Rohan Beats", bio: "Music producer & beat maker. EDM, Lo-fi, Hip Hop.", genres: ["EDM", "Lo-fi", "Hip Hop"], skills: ["Producer", "Mixing Engineer"], looking_for: ["Vocalist", "Rapper"], avatar_url: null, sample_url: null },
  { id: "4", display_name: "Meera Kapoor", bio: "Indie artist from Delhi. Acoustic singer-songwriter.", genres: ["Acoustic", "Indie Pop"], skills: ["Vocalist", "Guitarist", "Lyricist"], looking_for: ["Producer", "Violinist"], avatar_url: null, sample_url: null },
  { id: "5", display_name: "Kabir Singh", bio: "Hip Hop artist and rapper. Hindi rap scene.", genres: ["Hip Hop", "R&B"], skills: ["Rapper", "Lyricist"], looking_for: ["Beat Maker", "Vocalist"], avatar_url: null, sample_url: null },
  { id: "6", display_name: "Ananya Das", bio: "Lo-fi and chill beats creator from Kolkata.", genres: ["Lo-fi", "Jazz", "Acoustic"], skills: ["Producer", "Pianist"], looking_for: ["Vocalist", "Guitarist"], avatar_url: null, sample_url: null },
];

const SKILLS = ["Vocalist", "Producer", "Lyricist", "Guitarist", "Pianist", "Rapper", "Mixing Engineer", "Composer", "Drummer", "Violinist"];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CollaboratePage() {
  const [tab, setTab] = useState<"discover" | "requests" | "profile">("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Profile state
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileGenres, setProfileGenres] = useState<string[]>([]);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [profileLooking, setProfileLooking] = useState<string[]>([]);
  const [profilePublic, setProfilePublic] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const filteredArtists = DEMO_ARTISTS.filter(a => {
    const matchesSearch = a.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !genreFilter || a.genres.includes(genreFilter);
    return matchesSearch && matchesGenre;
  });

  const sendRequest = (id: string) => {
    setSentRequests(new Set([...sentRequests, id]));
  };

  const toggleArray = (arr: string[], item: string) => {
    return arr.includes(item) ? arr.filter(a => a !== item) : [...arr, item];
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Collaborate</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Discover artists, producers, and musicians. Build your team.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
        {[
          { id: "discover" as const, label: "Discover", icon: Search },
          { id: "requests" as const, label: "Requests", icon: MessageSquare },
          { id: "profile" as const, label: "My Profile", icon: UserPlus },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                tab === t.id ? "gradient-primary text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Discover Tab */}
        {tab === "discover" && (
          <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search artists, producers..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-muted"
              >
                <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold mb-2">Genre</p>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setGenreFilter("")} className={`rounded-full px-2.5 py-1 text-xs ${!genreFilter ? "gradient-primary text-white" : "border border-border"}`}>All</button>
                  {GENRES.slice(0, 10).map(g => (
                    <button key={g} onClick={() => setGenreFilter(g)} className={`rounded-full px-2.5 py-1 text-xs ${genreFilter === g ? "gradient-primary text-white" : "border border-border"}`}>{g}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Artist Grid */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
              {filteredArtists.map(artist => (
                <motion.div key={artist.id} variants={fadeUp} className="rounded-xl border border-border bg-card p-5 hover:border-violet-500/20 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {artist.display_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{artist.display_name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{artist.bio}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {artist.genres.map(g => (
                      <span key={g} className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-500">{g}</span>
                    ))}
                    {artist.skills.map(s => (
                      <span key={s} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">{s}</span>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">Looking for: </span>
                    {artist.looking_for.join(", ")}
                  </div>

                  {sentRequests.has(artist.id) ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/5 rounded-lg p-2">
                      <Check className="h-3.5 w-3.5" /> Request Sent
                    </div>
                  ) : (
                    <button
                      onClick={() => sendRequest(artist.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg gradient-primary py-2 text-xs font-semibold text-white"
                    >
                      <Send className="h-3 w-3" /> Send Collab Request
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Requests Tab */}
        {tab === "requests" && (
          <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No Pending Requests</h3>
              <p className="text-sm text-muted-foreground mt-1">When artists send you collaboration requests, they&apos;ll appear here.</p>
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your artist name" className="mt-1.5 w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm focus:border-violet-500 focus:outline-none" />
              </div>

              <div>
                <label className="text-sm font-medium">Bio</label>
                <textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="Tell other artists about yourself..." rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm resize-none focus:border-violet-500 focus:outline-none" />
              </div>

              <div>
                <label className="text-sm font-medium">Genres</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {GENRES.slice(0, 12).map(g => (
                    <button key={g} onClick={() => setProfileGenres(toggleArray(profileGenres, g))} className={`rounded-full px-2.5 py-1 text-xs transition-all ${profileGenres.includes(g) ? "gradient-primary text-white" : "border border-border"}`}>{g}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {SKILLS.map(s => (
                    <button key={s} onClick={() => setProfileSkills(toggleArray(profileSkills, s))} className={`rounded-full px-2.5 py-1 text-xs transition-all ${profileSkills.includes(s) ? "bg-blue-500 text-white" : "border border-border"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Looking For</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {SKILLS.map(s => (
                    <button key={s} onClick={() => setProfileLooking(toggleArray(profileLooking, s))} className={`rounded-full px-2.5 py-1 text-xs transition-all ${profileLooking.includes(s) ? "bg-emerald-500 text-white" : "border border-border"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={profilePublic} onChange={e => setProfilePublic(e.target.checked)} className="h-4 w-4 rounded accent-violet-500" />
                <span className="text-sm">Make my profile public (visible to other artists)</span>
              </label>

              <button
                onClick={() => setProfileSaved(true)}
                className="w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-white"
              >
                {profileSaved ? "✓ Profile Saved" : "Save Profile"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
