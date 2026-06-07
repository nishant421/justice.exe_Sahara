"use client";

import Link from "next/link";
import { Shield, Mic, FileText, Heart, ChevronRight, Phone, Scale, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0f4c75 40%, #f8fafc 100%)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(20,184,166,0.2)", border: "2px solid #14b8a6" }}>
            <Shield className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-wide">Sahara</span>
            <span className="text-teal-300 font-bold text-xl ml-2">सहारा</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-teal-200 hover:text-white text-sm transition-colors">
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#14b8a6", color: "white" }}
          >
            Get Help Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
          style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.4)", color: "#5eead4" }}>
          <Heart className="w-4 h-4" />
          <span>Trauma-Informed · Confidential · Free</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          हर आवाज़ को
          <br />
          <span style={{ color: "#14b8a6" }}>न्याय मिले</span>
        </h1>
        <p className="text-xl text-blue-200 mb-4 font-medium">Every voice deserves justice.</p>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
          Sahara is your compassionate AI companion — a safe space to understand your rights,
          navigate legal processes, and find support for POCSO and POSH cases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-2xl"
            style={{ background: "#14b8a6", color: "white" }}
          >
            <Mic className="w-5 h-5" />
            Start a Conversation
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/chat?text=true"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "2px solid rgba(255,255,255,0.3)" }}
          >
            <FileText className="w-5 h-5" />
            Type Instead
          </Link>
        </div>

        {/* Emergency Bar */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl flex flex-wrap justify-center gap-6"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <span className="text-red-300 font-semibold text-sm flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Contacts:
          </span>
          {[["112", "Police"], ["1098", "Childline"], ["181", "Women"], ["9152987821", "iCALL"]].map(([num, label]) => (
            <span key={num} className="text-white text-sm">
              <span style={{ color: "#fca5a5" }} className="font-bold">{num}</span>
              <span className="text-blue-200 ml-1">({label})</span>
            </span>
          ))}
        </div>
      </section>

      {/* White section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1e3a5f" }}>
              Why Sahara is Different
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We don't just provide information. We listen first.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" style={{ color: "#14b8a6" }} />,
                title: "Empathy First",
                desc: "Every response validates your feelings before providing information. You will never be judged, questioned, or blamed.",
                bg: "#f0fdfa",
                border: "#99f6e4",
              },
              {
                icon: <Mic className="w-8 h-8" style={{ color: "#2d5a8e" }} />,
                title: "Your Voice Matters",
                desc: "Speak naturally in Hindi or English. Sahara listens, understands, and responds in the language you're most comfortable with.",
                bg: "#eff6ff",
                border: "#bfdbfe",
              },
              {
                icon: <Scale className="w-8 h-8" style={{ color: "#7c3aed" }} />,
                title: "Legal Clarity",
                desc: "Know your rights under POCSO and POSH. Understand the process in simple terms. Get an actionable plan, not just information.",
                bg: "#faf5ff",
                border: "#ddd6fe",
              },
            ].map(({ icon, title, desc, bg, border }) => (
              <div key={title} className="p-8 rounded-2xl" style={{ background: bg, border: `1.5px solid ${border}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "white" }}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#1e3a5f" }}>{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Scenarios */}
      <section className="py-20" style={{ background: "#f0f7ff" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1e3a5f" }}>
              Who Sahara Helps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "👨‍👧",
                title: "Parent / Guardian",
                subtitle: "POCSO Case",
                desc: "Concerned about possible child abuse — understand mandatory reporting, police process, and how to protect the child.",
                link: "/chat?scenario=pocso",
                color: "#14b8a6",
              },
              {
                emoji: "👩‍💼",
                title: "Employee / Professional",
                subtitle: "POSH Case",
                desc: "Facing workplace harassment — learn about ICC, your rights, how to file a complaint, and what to expect.",
                link: "/chat?scenario=posh",
                color: "#2d5a8e",
              },
              {
                emoji: "👁️",
                title: "Witness / Concerned Person",
                subtitle: "Witness Reporting",
                desc: "Saw something suspicious — understand your duty to report, how to report safely, and witness protections.",
                link: "/chat?scenario=witness",
                color: "#7c3aed",
              },
            ].map(({ emoji, title, subtitle, desc, link, color }) => (
              <Link key={title} href={link} className="block p-8 rounded-2xl bg-white hover:shadow-xl transition-all hover:-translate-y-1 group" style={{ border: "1.5px solid #e2e8f0" }}>
                <div className="text-4xl mb-4">{emoji}</div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>
                  {subtitle}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#1e3a5f" }}>{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all" style={{ color }}>
                  Start conversation <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">The Reality We Address</h2>
          <p className="text-blue-200 mb-12">Every number represents a person who deserved to be heard.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "99%", label: "Sexual assault cases go unreported in India", note: "NCRB 2022" },
              { stat: "50%+", label: "Working women face workplace harassment", note: "Deloitte Survey 2023" },
              { stat: "1 in 4", label: "Children experience sexual abuse before 18", note: "Government of India Study" },
            ].map(({ stat, label, note }) => (
              <div key={stat} className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="text-5xl font-black mb-3" style={{ color: "#14b8a6" }}>{stat}</div>
                <p className="text-white font-medium mb-2">{label}</p>
                <p className="text-blue-300 text-sm">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/chat"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105"
              style={{ background: "#14b8a6", color: "white" }}
            >
              <Users className="w-5 h-5" />
              Be the Change — Start Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: "#0f766e" }} />
            <span className="font-bold text-gray-800">Sahara सहारा</span>
            <span className="text-gray-400 text-sm ml-2">— हर आवाज़ को न्याय मिले</span>
          </div>
          <p className="text-gray-400 text-sm text-center">
            Sahara provides information and support, not legal advice. Always consult a qualified legal professional for your specific situation.
          </p>
          <div className="flex gap-4">
            <Link href="/chat" className="text-teal-600 hover:text-teal-700 text-sm font-medium">Chat</Link>
            <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 text-sm font-medium">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
