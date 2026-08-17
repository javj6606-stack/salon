"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  User,
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Salon Profile", href: "/dashboard/profile", icon: User },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "WhatsApp Setup", href: "/dashboard/whatsapp", icon: Settings },
  { name: "WhatsApp Chat", href: "/dashboard/chat", icon: MessageCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div
      className="flex h-screen"
      style={{ background: "linear-gradient(180deg, #FBF3EE 0%, #F8E9E1 100%)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          borderRight: "1px solid #F0DDD3",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="p-6" style={{ borderBottom: "1px solid #F0DDD3" }}>
          <h1
            className="font-display text-2xl"
            style={{ color: "#C6707A", fontWeight: 700 }}
          >
            Glowly ✨
          </h1>
          <p className="text-sm" style={{ color: "#A68880" }}>
            Salon Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={
                  isActive
                    ? { backgroundColor: "#F6E1E4", color: "#B85C6B" }
                    : { color: "#8A6F6A" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#FBF3EE";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid #F0DDD3" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium transition-colors"
            style={{ color: "#B4573D" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F7DED7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}