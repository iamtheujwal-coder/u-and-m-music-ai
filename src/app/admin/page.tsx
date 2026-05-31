"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users, FolderOpen, Cpu, CreditCard, AlertTriangle,
  HelpCircle, Dna, Search, ChevronDown
} from "lucide-react";

const tabs = ["Overview", "Users", "Projects", "Processing", "Payments", "Voice Models", "Support"];

const mockStats = [
  { label: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "text-violet-500" },
  { label: "Total Projects", value: "5,893", change: "+8%", icon: FolderOpen, color: "text-blue-500" },
  { label: "Processing Jobs", value: "342", change: "+15%", icon: Cpu, color: "text-amber-500" },
  { label: "Revenue (MTD)", value: "₹89,400", change: "+22%", icon: CreditCard, color: "text-emerald-500" },
  { label: "Failed Jobs", value: "12", change: "-5%", icon: AlertTriangle, color: "text-red-500" },
  { label: "Support Tickets", value: "28", change: "+3", icon: HelpCircle, color: "text-pink-500" },
];

const mockUsers = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", plan: "Pro Artist", projects: 24, joined: "May 2026" },
  { id: "2", name: "Rahul Patel", email: "rahul@email.com", plan: "Creator", projects: 12, joined: "Apr 2026" },
  { id: "3", name: "Ananya Gupta", email: "ananya@email.com", plan: "Free", projects: 2, joined: "May 2026" },
  { id: "4", name: "Vikram Singh", email: "vikram@email.com", plan: "Studio", projects: 45, joined: "Mar 2026" },
  { id: "5", name: "Neha Kapoor", email: "neha@email.com", plan: "Creator", projects: 8, joined: "May 2026" },
];

const planColors: Record<string, string> = {
  Free: "bg-muted text-muted-foreground",
  Creator: "bg-blue-500/10 text-blue-500",
  "Pro Artist": "bg-violet-500/10 text-violet-500",
  Studio: "bg-amber-500/10 text-amber-500",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your platform</p>
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-violet-500 text-violet-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {activeTab === "Overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                    <p className={`mt-1 text-xs ${stat.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                      {stat.change} from last month
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "Users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
                Filter <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Projects</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planColors[user.plan]}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">{user.projects}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {(activeTab !== "Overview" && activeTab !== "Users") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <Dna className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">The {activeTab} panel is under development.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
