"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, FolderOpen, Dna, CreditCard, Cpu, BarChart3,
  HelpCircle, AlertTriangle, Search, ChevronDown, ArrowUp, ArrowDown,
  Eye, Trash2, Check, X, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "voice_models", label: "Voice Models", icon: Dna },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalVoiceModels: 0,
    totalPayments: 0,
    totalRevenue: 0,
    activeJobs: 0,
    openTickets: 0,
    flaggedContent: 0,
  });

  useEffect(() => {
    // Load data from demo mode
    const loadDemoData = () => {
      const storedProjects = localStorage.getItem("demo_projects");
      let parsedProjects = [];
      if (storedProjects) {
        try {
          const mapData = JSON.parse(storedProjects);
          parsedProjects = mapData.map((item: any) => item[1]);
        } catch (e) {
          console.error(e);
        }
      }

      const storedModels = localStorage.getItem("demo_voice_models");
      let parsedModels = [];
      if (storedModels) {
        try {
          parsedModels = JSON.parse(storedModels);
        } catch (e) {}
      }

      setProjectsList(parsedProjects);

      setAdminData({
        totalUsers: 1, // Only demo user
        totalProjects: parsedProjects.length,
        totalVoiceModels: parsedModels.length,
        totalPayments: 0,
        totalRevenue: 0,
        activeJobs: parsedProjects.filter((p: any) => p.status === "processing").length,
        openTickets: 0,
        flaggedContent: 0,
      });

      setLoading(false);
    };

    loadDemoData();
  }, []);

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      free: "bg-gray-500/10 text-gray-500",
      creator: "bg-blue-500/10 text-blue-500",
      pro_artist: "bg-violet-500/10 text-violet-500",
      studio: "bg-emerald-500/10 text-emerald-500",
    };
    return colors[plan] || "bg-gray-500/10 text-gray-500";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-500/10 text-red-500",
      in_progress: "bg-amber-500/10 text-amber-500",
      resolved: "bg-emerald-500/10 text-emerald-500",
      closed: "bg-gray-500/10 text-gray-500",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Admin Dashboard</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Manage users, projects, payments, and platform operations.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                activeTab === tab.id ? "gradient-primary text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Users", value: adminData.totalUsers, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", trend: "+12%" },
              { label: "Total Projects", value: adminData.totalProjects, icon: FolderOpen, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+23%" },
              { label: "Voice Models", value: adminData.totalVoiceModels, icon: Dna, color: "text-pink-500", bg: "bg-pink-500/10", trend: "+8" },
              { label: "Revenue", value: `₹${(adminData.totalRevenue / 1000).toFixed(0)}K`, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+18%" },
              { label: "Active Jobs", value: adminData.activeJobs, icon: Cpu, color: "text-amber-500", bg: "bg-amber-500/10", trend: "" },
              { label: "Open Tickets", value: adminData.openTickets, icon: HelpCircle, color: "text-red-500", bg: "bg-red-500/10", trend: "-3" },
              { label: "Payments", value: adminData.totalPayments, icon: CreditCard, color: "text-violet-500", bg: "bg-violet-500/10", trend: "+14" },
              { label: "Flagged", value: adminData.flaggedContent, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", trend: "" },
            ].map((stat, i) => {
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
                  {stat.trend && (
                    <span className="text-xs text-emerald-500 flex items-center gap-0.5 mt-1">
                      <ArrowUp className="h-3 w-3" /> {stat.trend}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Quick Charts */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-4">Plan Distribution</h3>
              <div className="space-y-3">
                {[
                  { plan: "Free", pct: 45, color: "from-gray-400 to-gray-500" },
                  { plan: "Creator", pct: 28, color: "from-blue-400 to-blue-500" },
                  { plan: "Pro Artist", pct: 20, color: "from-violet-400 to-violet-500" },
                  { plan: "Studio", pct: 7, color: "from-emerald-400 to-emerald-500" },
                ].map(p => (
                  <div key={p.plan}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{p.plan}</span>
                      <span className="font-bold">{p.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.pct}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-4">Daily Signups (Last 7 Days)</h3>
              <div className="flex items-end gap-2 h-32">
                {[12, 18, 8, 24, 16, 22, 30].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / 30) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-violet-500 to-blue-400"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Title</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Mode</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {projectsList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground text-sm">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  projectsList.map(project => (
                    <tr key={project.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-sm">{project.title || "Untitled"}</td>
                      <td className="p-3 text-xs capitalize text-muted-foreground">{project.mode?.replace("_", " ")}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Other tabs show placeholder */}
      {!["overview", "projects"].includes(activeTab) && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold">{TABS.find(t => t.id === activeTab)?.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">This section is currently under development.</p>
        </div>
      )}
    </div>
  );
}
