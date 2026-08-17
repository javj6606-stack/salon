"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [conversationsCount, setConversationsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [{ data: salon }, { data: appointments }, { count: convoCount }] = await Promise.all([
        supabase.from("salons").select("services").eq("user_id", user.id).single(),
        supabase.from("appointments").select("*").eq("user_id", user.id),
        supabase.from("conversations").select("*", { count: "exact", head: true }),
      ]);

      const allAppointments = appointments || [];

      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const mondayStr = monday.toISOString().split("T")[0];
      const sundayStr = sunday.toISOString().split("T")[0];

      let today = 0;
      let week = 0;
      const statuses: Record<string, number> = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

      allAppointments.forEach((a: any) => {
        if (a.appointment_date === todayStr) today++;
        if (a.appointment_date >= mondayStr && a.appointment_date <= sundayStr) week++;
        if (statuses[a.status] !== undefined) statuses[a.status]++;
      });

      setTodayCount(today);
      setWeekCount(week);
      setStatusCounts(statuses);
      setConversationsCount(convoCount || 0);

      const priceMap: Record<string, number> = {};
      (salon?.services || []).forEach((s: any) => {
        priceMap[s.name] = parseFloat(s.price) || 0;
      });

      const totalRevenue = allAppointments
        .filter((a: any) => a.status === "completed")
        .reduce((sum: number, a: any) => sum + (priceMap[a.service_name] || 0), 0);

      setRevenue(totalRevenue);
      setLoading(false);
    }

    loadStats();
  }, []);

  const statCards = [
    { label: "Aaj ki Appointments", value: todayCount, icon: "🗓️" },
    { label: "Is Hafte ki Appointments", value: weekCount, icon: "📅" },
    { label: "WhatsApp Conversations", value: conversationsCount, icon: "💬" },
    { label: "Estimated Revenue", value: `Rs ${revenue.toLocaleString()}`, icon: "✨" },
  ];

  const statusCards = [
    { label: "Pending", value: statusCounts.pending, bg: "#FBF0DF", text: "#8A6A2F", dot: "#C9A26B" },
    { label: "Confirmed", value: statusCounts.confirmed, bg: "#F6E1E4", text: "#B85C6B", dot: "#C6707A" },
    { label: "Completed", value: statusCounts.completed, bg: "#E7EFE3", text: "#5C7A52", dot: "#8FAE82" },
    { label: "Cancelled", value: statusCounts.cancelled, bg: "#F7DED7", text: "#B4573D", dot: "#C97B5E" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FBF3EE 0%, #F8E9E1 45%, #F3D9CE 100%)",
      }}
    >
      {/* Signature soft "glow" blob behind the header */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #E8B4A6 0%, transparent 70%)" }}
      />

      {/* Decorative botanical line-art, faint, top-right */}
      <svg
        className="pointer-events-none absolute top-0 right-0 w-[420px] h-[420px] opacity-[0.10]"
        viewBox="0 0 400 400"
        fill="none"
        stroke="#B85C6B"
        strokeWidth="1.4"
      >
        <path d="M340 40C300 90 280 150 300 220C320 290 300 340 250 370" strokeLinecap="round" />
        <path d="M300 90C270 100 245 95 225 70" strokeLinecap="round" />
        <path d="M310 150C275 155 250 145 235 120" strokeLinecap="round" />
        <path d="M310 220C275 225 250 218 232 198" strokeLinecap="round" />
        <ellipse cx="223" cy="66" rx="14" ry="8" transform="rotate(-30 223 66)" />
        <ellipse cx="232" cy="116" rx="14" ry="8" transform="rotate(-20 232 116)" />
        <ellipse cx="229" cy="195" rx="14" ry="8" transform="rotate(-15 229 195)" />
      </svg>

      {/* Small botanical sprig, bottom-left, even fainter */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-[260px] h-[260px] opacity-[0.08]"
        viewBox="0 0 260 260"
        fill="none"
        stroke="#C9A26B"
        strokeWidth="1.4"
      >
        <path d="M20 250C60 210 80 170 70 120C60 70 80 40 120 20" strokeLinecap="round" />
        <ellipse cx="78" cy="150" rx="12" ry="7" transform="rotate(35 78 150)" />
        <ellipse cx="68" cy="100" rx="12" ry="7" transform="rotate(20 68 100)" />
      </svg>

      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase"
          style={{ color: "#C6707A" }}
        >
          Aaj ka Overview
        </p>
        <h1
          className="font-display mt-2 text-4xl md:text-5xl"
          style={{ fontWeight: 700, color: "#3B2A2E" }}
        >
          Glowly Dashboard
        </h1>
        <p className="mt-2" style={{ color: "#8A6F6A" }}>
          Ek nazar mein salon ka poora haal 🌸
        </p>

        {loading ? (
          <p className="mt-10" style={{ color: "#8A6F6A" }}>
            Loading...
          </p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl p-6 bg-white/80 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    border: "1px solid #F0DDD3",
                    boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
                  }}
                >
                  <span className="text-2xl">{card.icon}</span>
                  <p
                    className="text-xs font-medium tracking-wide uppercase mt-3"
                    style={{ color: "#A68880" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="font-display mt-1 text-3xl"
                    style={{ fontWeight: 700, color: "#3B2A2E" }}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Status breakdown */}
            <div className="mt-12">
              <h2
                className="font-display text-lg mb-4"
                style={{ fontWeight: 600, color: "#3B2A2E" }}
              >
                Appointments ka Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {statusCards.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-3xl p-6"
                    style={{ backgroundColor: s.bg }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: s.dot }}
                      />
                      <p className="text-sm font-medium" style={{ color: s.text }}>
                        {s.label}
                      </p>
                    </div>
                    <p className="text-2xl font-bold mt-2" style={{ color: s.text }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-8 text-xs" style={{ color: "#B09B94" }}>
              💡 Revenue sirf "completed" appointments se calculate hoti hai, salon profile mein di gayi service prices ke hisaab se.
            </p>
          </>
        )}
      </div>
    </div>
  );
}