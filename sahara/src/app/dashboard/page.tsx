"use client";

import Link from "next/link";
import {
  Shield, MessageSquare, AlertTriangle, Globe, Clock,
  TrendingUp, Users, ChevronLeft, Activity
} from "lucide-react";

const MOCK_STATS = {
  totalConversations: 1247,
  pocsoCases: 423,
  poshCases: 389,
  witnessReports: 156,
  emergencyEscalations: 67,
  languagesUsed: { hindi: 58, english: 42 },
  avgResolutionMinutes: 8.4,
  actionPlansGenerated: 891,
  satisfactionRate: 96,
};

const RECENT_CASES = [
  { id: "C-1247", type: "POCSO", status: "Action Plan Sent", time: "2 min ago", flag: "🔴" },
  { id: "C-1246", type: "POSH", status: "Rights Explained", time: "7 min ago", flag: "🔵" },
  { id: "C-1245", type: "WITNESS", status: "Report Guidance", time: "15 min ago", flag: "🟣" },
  { id: "C-1244", type: "POCSO", status: "Emergency Escalated", time: "22 min ago", flag: "🔴" },
  { id: "C-1243", type: "POSH", status: "ICC Explained", time: "31 min ago", flag: "🔵" },
  { id: "C-1242", type: "GENERAL", status: "Information Shared", time: "45 min ago", flag: "🟢" },
];

const MONTHLY_DATA = [42, 58, 67, 89, 102, 118, 134, 147, 156, 178, 198, 212];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MAX_VAL = Math.max(...MONTHLY_DATA);

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)" }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "#1e3a5f" }}>Sahara Dashboard</h1>
                <p className="text-xs text-gray-500">Demo Analytics · Mock Data</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4" }}>
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Live Demo
            </div>
            <Link
              href="/chat"
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)", color: "white" }}
            >
              Open Sahara
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: <MessageSquare className="w-6 h-6" />,
              label: "Total Conversations",
              value: MOCK_STATS.totalConversations.toLocaleString(),
              delta: "+12% this month",
              color: "#1e3a5f",
              bg: "#eff6ff",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              label: "POCSO Cases",
              value: MOCK_STATS.pocsoCases.toLocaleString(),
              delta: "34% of total",
              color: "#dc2626",
              bg: "#fef2f2",
            },
            {
              icon: <Users className="w-6 h-6" />,
              label: "POSH Cases",
              value: MOCK_STATS.poshCases.toLocaleString(),
              delta: "31% of total",
              color: "#2563eb",
              bg: "#eff6ff",
            },
            {
              icon: <AlertTriangle className="w-6 h-6" />,
              label: "Emergency Escalations",
              value: MOCK_STATS.emergencyEscalations.toLocaleString(),
              delta: "5.4% of total",
              color: "#d97706",
              bg: "#fffbeb",
            },
          ].map(({ icon, label, value, delta, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg, color }}>
                {icon}
              </div>
              <div className="text-3xl font-black mb-1" style={{ color: "#1e293b" }}>{value}</div>
              <div className="text-sm font-medium text-gray-600">{label}</div>
              <div className="text-xs mt-1 font-semibold" style={{ color }}>{delta}</div>
            </div>
          ))}
        </div>

        {/* Second row */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5" style={{ color: "#0f766e" }} />
              <h3 className="font-bold text-gray-900">Languages Used</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">हिंदी (Hindi)</span>
                  <span className="font-bold" style={{ color: "#0f766e" }}>{MOCK_STATS.languagesUsed.hindi}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${MOCK_STATS.languagesUsed.hindi}%`, background: "linear-gradient(90deg, #0f766e, #14b8a6)" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">English</span>
                  <span className="font-bold" style={{ color: "#1e3a5f" }}>{MOCK_STATS.languagesUsed.english}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${MOCK_STATS.languagesUsed.english}%`, background: "linear-gradient(90deg, #1e3a5f, #2d5a8e)" }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Bilingual support is critical — 58% use Hindi</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" style={{ color: "#2563eb" }} />
              <h3 className="font-bold text-gray-900">Response Metrics</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Avg Response Time", value: "1.8s", icon: "⚡" },
                { label: "Avg Session Length", value: `${MOCK_STATS.avgResolutionMinutes} min`, icon: "⏱️" },
                { label: "Action Plans Generated", value: MOCK_STATS.actionPlansGenerated.toLocaleString(), icon: "📋" },
                { label: "Satisfaction Rate", value: `${MOCK_STATS.satisfactionRate}%`, icon: "💙" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <span>{icon}</span> {label}
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#1e3a5f" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: "#7c3aed" }} />
              <h3 className="font-bold text-gray-900">Case Distribution</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "POCSO", value: 34, color: "#dc2626" },
                { label: "POSH", value: 31, color: "#2563eb" },
                { label: "Witness Reports", value: 13, color: "#7c3aed" },
                { label: "General Inquiry", value: 17, color: "#0f766e" },
                { label: "Emergency", value: 5, color: "#d97706" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{label}</span>
                    <span className="font-bold" style={{ color }}>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart + Recent Cases */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5" style={{ color: "#0f766e" }} />
              <h3 className="font-bold text-gray-900">Monthly Conversations (2025)</h3>
            </div>
            <div className="flex items-end gap-2 h-40">
              {MONTHLY_DATA.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${(val / MAX_VAL) * 130}px`,
                      background: i === 11 ? "linear-gradient(180deg, #14b8a6, #0f766e)" : "linear-gradient(180deg, #93c5fd, #2563eb)",
                    }}
                    title={`${val} conversations`}
                  />
                  <span className="text-xs text-gray-400" style={{ fontSize: "9px" }}>{MONTHS[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">↑ 68% growth since January 2025</p>
          </div>

          {/* Recent Cases */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" style={{ color: "#1e3a5f" }} />
                Recent Sessions
              </h3>
              <span className="text-xs text-gray-400">Live feed (anonymized)</span>
            </div>
            <div className="space-y-3">
              {RECENT_CASES.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#f8fafc" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{c.id}</div>
                      <div className="text-xs text-gray-500">{c.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-700">{c.status}</div>
                    <div className="text-xs text-gray-400">{c.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="mt-8 p-8 rounded-3xl text-center" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%)" }}>
          <h2 className="text-2xl font-black text-white mb-3">हर आवाज़ को न्याय मिले</h2>
          <p className="text-teal-200 mb-6 max-w-2xl mx-auto">
            Every statistic above represents a real person who found the courage to reach out.
            Sahara ensures no voice goes unheard.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
            style={{ background: "#14b8a6", color: "white" }}
          >
            <Shield className="w-4 h-4" />
            Experience Sahara
          </Link>
        </div>
      </div>
    </div>
  );
}
