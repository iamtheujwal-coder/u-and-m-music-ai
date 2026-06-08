"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, BarChart3, Users, Music, Calendar, Clock,
  ArrowUp, ArrowDown, Target, Zap, Star, Globe
} from "lucide-react";
import type { CareerStats } from "@/lib/types";

const demoStats: CareerStats = {
  total_streams: 12847,
  monthly_growth: 23.5,
  followers: 342,
  engagement_rate: 8.7,
  top_song: "Tum Se Hi (Cover)",
  best_release_day: "Friday",
  best_genre: "Bollywood Pop",
  content_suggestions: [
    "Post a 30-second vocal reel on Instagram with trending audio",
    "Release a stripped-back acoustic version of your most streamed song",
    "Collaborate with a producer in your genre for cross-promotion",
    "Share behind-the-scenes recording content to build personal brand",
    "Engage with 10 similar artists daily to grow your network",
  ],
  weekly_data: [
    { week: "W1", streams: 1200, followers: 310 },
    { week: "W2", streams: 1450, followers: 318 },
    { week: "W3", streams: 1380, followers: 322 },
    { week: "W4", streams: 1920, followers: 329 },
    { week: "W5", streams: 2100, followers: 334 },
    { week: "W6", streams: 1890, followers: 337 },
    { week: "W7", streams: 2350, followers: 340 },
    { week: "W8", streams: 2557, followers: 342 },
  ],
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CareerPage() {
  const [stats] = useState<CareerStats>(demoStats);
  const maxStreams = Math.max(...stats.weekly_data.map(d => d.streams));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Career OS</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Track your growth, analyze performance, and get strategic content recommendations.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Streams", value: stats.total_streams.toLocaleString(), icon: Music, color: "text-violet-500", bg: "bg-violet-500/10", trend: "+23.5%" },
          { label: "Followers", value: stats.followers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12" },
          { label: "Engagement", value: `${stats.engagement_rate}%`, icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+2.1%" },
          { label: "Monthly Growth", value: `${stats.monthly_growth}%`, icon: TrendingUp, color: "text-pink-500", bg: "bg-pink-500/10", trend: "↑" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={fadeUp} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-xs text-emerald-500 flex items-center gap-0.5 mt-1">
                <ArrowUp className="h-3 w-3" /> {stat.trend}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Streams Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-500" /> Weekly Streams
          </h3>
          <span className="text-xs text-muted-foreground">Last 8 weeks</span>
        </div>
        <div className="flex items-end gap-2 h-40">
          {stats.weekly_data.map((d, i) => (
            <motion.div
              key={d.week}
              initial={{ height: 0 }}
              animate={{ height: `${(d.streams / maxStreams) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-xs font-mono text-muted-foreground">{(d.streams / 1000).toFixed(1)}k</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-blue-400 min-h-[4px]"
                style={{ flex: 1 }}
              />
              <span className="text-[10px] text-muted-foreground">{d.week}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Growth Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" /> Follower Growth
        </h3>
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 800 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              d={`M 0 ${130 - (stats.weekly_data[0].followers - 300) * 3} ${stats.weekly_data.map((d, i) => `L ${(i / (stats.weekly_data.length - 1)) * 800} ${130 - (d.followers - 300) * 3}`).join(" ")} L 800 130 L 0 130 Z`}
              fill="url(#followerGrad)"
            />
            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
              d={`M 0 ${130 - (stats.weekly_data[0].followers - 300) * 3} ${stats.weekly_data.map((d, i) => `L ${(i / (stats.weekly_data.length - 1)) * 800} ${130 - (d.followers - 300) * 3}`).join(" ")}`}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Dots */}
            {stats.weekly_data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (stats.weekly_data.length - 1)) * 800}
                cy={130 - (d.followers - 300) * 3}
                r="4"
                fill="#8b5cf6"
              />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Recommendations */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Best Release Strategy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" /> Best Strategy
          </h3>
          <div className="space-y-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Best Release Day</p>
              <p className="text-sm font-bold flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-violet-500" /> {stats.best_release_day}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Best Time</p>
              <p className="text-sm font-bold flex items-center gap-1 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-blue-500" /> 6:00 PM IST
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Best Genre</p>
              <p className="text-sm font-bold flex items-center gap-1 mt-0.5">
                <Music className="h-3.5 w-3.5 text-pink-500" /> {stats.best_genre}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Top Song</p>
              <p className="text-sm font-bold flex items-center gap-1 mt-0.5">
                <Star className="h-3.5 w-3.5 text-amber-500" /> {stats.top_song}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-violet-500" /> Content Suggestions
          </h3>
          <div className="space-y-2">
            {stats.content_suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex gap-3 rounded-xl bg-muted/50 p-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[10px] font-bold text-violet-500 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{s}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
