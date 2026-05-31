"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Send, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { TICKET_CATEGORIES } from "@/lib/constants";

const mockTickets = [
  { id: "1", subject: "Audio processing stuck at 85%", category: "Audio Processing Issue", status: "in_progress", date: "May 30, 2026" },
  { id: "2", subject: "Payment deducted but plan not upgraded", category: "Payment Issue", status: "open", date: "May 29, 2026" },
  { id: "3", subject: "Output quality too low on vocal", category: "Output Quality Issue", status: "resolved", date: "May 28, 2026" },
];

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  open: { color: "bg-amber-500/10 text-amber-500", icon: Clock, label: "Open" },
  in_progress: { color: "bg-blue-500/10 text-blue-500", icon: MessageSquare, label: "In Progress" },
  resolved: { color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle, label: "Resolved" },
};

export default function SupportPage() {
  const [tab, setTab] = useState<"create" | "tickets">("tickets");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTab("tickets");
    setCategory("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-violet-500" /> Support
          </h1>
          <p className="mt-1 text-muted-foreground">Need help? Create a ticket or check existing ones.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setTab("tickets")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              tab === "tickets" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => setTab("create")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              tab === "create" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Ticket
          </button>
        </div>

        {tab === "tickets" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {mockTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
                <HelpCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No tickets yet</p>
              </div>
            ) : (
              mockTickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const StatusIcon = status.icon;
                return (
                  <div key={ticket.id} className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{ticket.category}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{ticket.date}</p>
                  </div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-border bg-background py-3 px-4 text-sm focus:border-violet-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {TICKET_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Brief description of your issue"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background py-3 px-4 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-background py-3 px-4 text-sm resize-none focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              <Send className="h-4 w-4" /> Submit Ticket
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
