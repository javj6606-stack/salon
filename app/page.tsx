import Link from "next/link";
import {
  CalendarCheck,
  MessageCircle,
  Bot,
  Users,
  BarChart3,
  Sparkles,
  Phone,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Smart Appointments",
    desc: "Calendar, staff assignment, buffers and automated reminders that actually convert.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Inbox",
    desc: "One shared inbox for every client chat. AI drafts, you approve — or let it fly solo.",
  },
  {
    icon: Bot,
    title: "AI Receptionist",
    desc: "Books, reschedules and answers FAQs in Urdu and English — 24 hours a day.",
  },
  {
    icon: Users,
    title: "Client CRM",
    desc: "History, preferences, birthdays and lifetime value in a single glowing profile.",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    desc: "See what's working across services, staff and campaigns — beautifully visualised.",
  },
  {
    icon: Sparkles,
    title: "Marketing on Autopilot",
    desc: "Generate posts, campaigns and win-back flows in your brand voice, in seconds.",
  },
];

const agents = [
  { name: "Receptionist Agent", desc: "Answers, books, reschedules — 24/7 in Urdu & English." },
  { name: "Retention Agent", desc: "Wins back inactive clients with birthday & follow-up flows." },
  { name: "Marketing Agent", desc: "Writes captions, campaigns and seasonal offers in your voice." },
  { name: "Voice AI Agent", desc: "Confirmation calls, reminders and callbacks that sound human." },
];

const steps = [
  { title: "Sign up in 2 minutes", desc: "Create your salon profile — name, address, services and staff." },
  { title: "Connect WhatsApp", desc: "Link your WhatsApp Business number in a single guided step." },
  { title: "Train your AI", desc: "Add your services, pricing and FAQs. Glowly does the rest." },
  { title: "Go live & grow", desc: "Watch bookings, revenue and 5-star reviews roll in." },
];

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <header className="border-b border-rose-100">
        <div className="container-glowly flex items-center justify-between py-4">
          <span className="font-display text-2xl font-semibold text-rose-600">Glowly</span>
          <nav className="hidden md:flex gap-8 text-sm text-ink/70">
            <a href="#features">Features</a>
            <a href="#agents">AI Agents</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
          </nav>
          <Link
            href="/auth"
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600 transition"
          >
            Start free trial
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container-glowly py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block rounded-full bg-gold-400/20 text-gold-600 text-xs font-medium px-3 py-1 mb-6">
            New · AI Receptionist in Urdu &amp; English
          </span>
          <h1 className="font-display text-4xl md:text-6xl leading-tight font-medium text-ink">
            Your salon,
            <br />
            running on autopilot.
          </h1>
          <p className="mt-6 text-lg text-ink/70 max-w-md">
            Glowly is the AI-powered operating system for beauty salons and
            clinics. Book on WhatsApp, answer clients 24/7, manage staff, and
            grow revenue — all from one beautiful dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="rounded-full bg-rose-500 px-6 py-3 font-medium text-white hover:bg-rose-600 transition"
            >
              Start 14-day free trial
            </Link>
            <a
              href="#demo"
              className="rounded-full border border-rose-200 px-6 py-3 font-medium text-ink hover:bg-rose-50 transition"
            >
              See a live demo
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/50">
            ★ 4.9 — Loved by 1,200+ salons across Pakistan
          </p>
        </div>
        <div className="rounded-xl2 bg-gradient-to-br from-rose-100 to-gold-400/30 p-6">
          <div className="rounded-xl bg-white shadow-sm p-4 mb-3">
            <p className="text-xs text-ink/50">New booking</p>
            <p className="font-medium">Ayesha · Bridal Facial · 3 PM</p>
          </div>
          <div className="rounded-xl bg-white shadow-sm p-4">
            <p className="text-xs text-ink/50">This month</p>
            <p className="font-display text-2xl">PKR 842k</p>
            <p className="text-xs text-green-600">↑ 34% vs last month</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-glowly py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-center max-w-2xl mx-auto">
          Everything your salon needs, nothing it doesn&apos;t.
        </h2>
        <p className="text-center text-ink/60 mt-4 max-w-xl mx-auto">
          A single beautiful workspace for bookings, clients, chats, staff and
          growth — powered end-to-end by AI.
        </p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl2 border border-rose-100 p-6">
              <f.icon className="text-rose-500" size={28} />
              <h3 className="mt-4 font-medium text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Agents */}
      <section id="agents" className="bg-ink text-white py-16 md:py-24">
        <div className="container-glowly">
          <h2 className="font-display text-3xl md:text-4xl text-center max-w-2xl mx-auto">
            A team of AI agents, working the front desk.
          </h2>
          <p className="text-center text-white/60 mt-4 max-w-xl mx-auto">
            Trained on beauty industry workflows and your salon&apos;s own
            knowledge base. They chat, book, upsell and follow up — while you
            focus on the chair.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {agents.map((a) => (
              <div key={a.name} className="rounded-xl2 bg-white/5 p-6 border border-white/10">
                <h3 className="font-medium text-lg text-gold-400">{a.name}</h3>
                <p className="mt-2 text-sm text-white/60">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-glowly py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-center max-w-2xl mx-auto">
          From setup to first booking in an afternoon.
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.title}>
              <span className="font-display text-3xl text-gold-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-glowly py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-center">
          Simple pricing. Serious results.
        </h2>
        <p className="text-center text-ink/60 mt-4">
          14-day free trial on every plan. Cancel anytime. Pay with Card,
          EasyPaisa or JazzCash.
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="rounded-xl2 border border-rose-100 p-8">
            <h3 className="font-medium text-lg">Basic</h3>
            <p className="text-sm text-ink/60 mt-1">
              Everything a growing salon needs to run smoothly.
            </p>
            <p className="font-display text-3xl mt-6">
              PKR 4,900<span className="text-sm text-ink/50"> / month</span>
            </p>
            <Link
              href="/auth"
              className="mt-6 block text-center rounded-full border border-rose-300 py-3 font-medium hover:bg-rose-50 transition"
            >
              Start free trial
            </Link>
          </div>
          <div className="rounded-xl2 border-2 border-rose-500 p-8 relative">
            <span className="absolute -top-3 left-6 bg-rose-500 text-white text-xs px-3 py-1 rounded-full">
              Most popular
            </span>
            <h3 className="font-medium text-lg">Premium</h3>
            <p className="text-sm text-ink/60 mt-1">
              Full AI suite. Unlimited growth. Multi-branch ready.
            </p>
            <p className="font-display text-3xl mt-6">
              PKR 12,900<span className="text-sm text-ink/50"> / month</span>
            </p>
            <Link
              href="/auth"
              className="mt-6 block text-center rounded-full bg-rose-500 text-white py-3 font-medium hover:bg-rose-600 transition"
            >
              Go Premium
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-glowly py-16 md:py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl">
          Give your salon superpowers.
        </h2>
        <p className="mt-4 text-ink/60">
          Join salons growing faster with Glowly. Free for 14 days. No card
          required.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/auth"
            className="rounded-full bg-rose-500 px-6 py-3 font-medium text-white hover:bg-rose-600 transition"
          >
            Start free trial
          </Link>
          <a
            href="#demo"
            className="rounded-full border border-rose-200 px-6 py-3 font-medium hover:bg-rose-50 transition"
          >
            Book a demo
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-100 py-12">
        <div className="container-glowly flex flex-col md:flex-row justify-between gap-8 text-sm text-ink/60">
          <div>
            <span className="font-display text-xl text-rose-600">Glowly</span>
            <p className="mt-2 max-w-xs">
              The AI salon OS built for beauty businesses in Pakistan and
              beyond.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-medium text-ink mb-2">Product</p>
              <ul className="space-y-1">
                <li><a href="#features">Features</a></li>
                <li><a href="#agents">AI Agents</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink mb-2">Company</p>
              <ul className="space-y-1">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="container-glowly mt-8 text-xs text-ink/40">
          © 2026 Glowly. Made with love in Pakistan. · PKR · EasyPaisa · JazzCash
        </p>
      </footer>
    </main>
  );
}
