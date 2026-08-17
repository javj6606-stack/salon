"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ backgroundColor: checked ? "#C6707A" : "#E9D6CC" }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");

  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyWhatsappReminder, setNotifyWhatsappReminder] = useState(true);

  const [autoConfirmBookings, setAutoConfirmBookings] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [message, setMessage] = useState("");

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email || "");

      const { data } = await supabase
        .from("salons")
        .select(
          "notify_new_booking, notify_whatsapp_reminder, auto_confirm_bookings"
        )
        .eq("user_id", user.id)
        .single();

      if (data) {
        setNotifyNewBooking(data.notify_new_booking ?? true);
        setNotifyWhatsappReminder(data.notify_whatsapp_reminder ?? true);
        setAutoConfirmBookings(data.auto_confirm_bookings ?? false);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("User not found. Please login again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("salons")
      .update({
        notify_new_booking: notifyNewBooking,
        notify_whatsapp_reminder: notifyWhatsappReminder,
        auto_confirm_bookings: autoConfirmBookings,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      setMessage("Error saving: " + error.message);
    } else {
      setMessage("Settings saved successfully! ✅");
    }
    setSaving(false);
  };

  const handlePasswordUpdate = async () => {
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordMessage("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords match nahi ho rahe.");
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMessage("Error: " + error.message);
    } else {
      setPasswordMessage("Password update ho gaya ✅");
      setNewPassword("");
      setConfirmPassword("");
    }
    setUpdatingPassword(false);
  };

  const handleResetAppointments = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    setResetting(true);
    setResetMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setResetMessage("User not found.");
      setResetting(false);
      return;
    }

    const { data: salon } = await supabase
      .from("salons")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!salon) {
      setResetMessage("Salon record nahi mila.");
      setResetting(false);
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("salon_id", salon.id);

    if (error) {
      setResetMessage("Error: " + error.message);
    } else {
      setResetMessage("Sab appointments delete ho gaye.");
    }
    setConfirmReset(false);
    setResetting(false);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.8)",
    border: "1px solid #F0DDD3",
    boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
  };
  const inputStyle =
    "w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 transition-colors";
  const inputBorderStyle = { borderColor: "#E9D6CC", ["--tw-ring-color" as any]: "#C6707A" } as React.CSSProperties;
  const disabledInputStyle = {
    borderColor: "#F0DDD3",
    backgroundColor: "#FBF3EE",
    color: "#A68880",
  } as React.CSSProperties;
  const labelStyle = { color: "#5A4844" };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <p style={{ color: "#8A6F6A" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#C6707A" }}>
        Salon
      </p>
      <h1 className="font-display mt-2 mb-8 text-4xl" style={{ fontWeight: 700, color: "#3B2A2E" }}>
        Settings
      </h1>

      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <div className="p-6 rounded-3xl space-y-5" style={cardStyle}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "#3B2A2E" }}>
            Account
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>
              Email
            </label>
            <input type="text" value={email} disabled className={inputStyle} style={disabledInputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            onClick={handlePasswordUpdate}
            disabled={updatingPassword || !newPassword}
            className="text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#C6707A" }}
            onMouseEnter={(e) => !updatingPassword && (e.currentTarget.style.backgroundColor = "#B85C6B")}
            onMouseLeave={(e) => !updatingPassword && (e.currentTarget.style.backgroundColor = "#C6707A")}
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>

          {passwordMessage && (
            <p
              className="text-sm"
              style={{
                color:
                  passwordMessage.includes("Error") || passwordMessage.includes("nahi")
                    ? "#B4573D"
                    : "#5C7A52",
              }}
            >
              {passwordMessage}
            </p>
          )}
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-3xl space-y-4" style={cardStyle}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "#3B2A2E" }}>
            Notifications
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#3B2A2E" }}>New Booking Alerts</p>
              <p className="text-xs" style={{ color: "#A68880" }}>
                Jab bhi naya booking aaye, notification milega
              </p>
            </div>
            <Toggle checked={notifyNewBooking} onChange={setNotifyNewBooking} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#3B2A2E" }}>WhatsApp Reminders</p>
              <p className="text-xs" style={{ color: "#A68880" }}>
                Customers ko appointment se pehle reminder bheja jaye
              </p>
            </div>
            <Toggle checked={notifyWhatsappReminder} onChange={setNotifyWhatsappReminder} />
          </div>
        </div>

        {/* Business Preferences */}
        <div className="p-6 rounded-3xl space-y-4" style={cardStyle}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "#3B2A2E" }}>
            Business Preferences
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#3B2A2E" }}>Auto-Confirm Bookings</p>
              <p className="text-xs" style={{ color: "#A68880" }}>
                On hone par WhatsApp AI khud booking confirm karega, off hone par manual approve karna hoga
              </p>
            </div>
            <Toggle checked={autoConfirmBookings} onChange={setAutoConfirmBookings} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                Currency
              </label>
              <input type="text" value="PKR" disabled className={inputStyle} style={disabledInputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                Timezone
              </label>
              <input
                type="text"
                value="Asia/Karachi (PKT)"
                disabled
                className={inputStyle}
                style={disabledInputStyle}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="w-full text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#C6707A" }}
          onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = "#B85C6B")}
          onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = "#C6707A")}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {message && (
          <p className="text-sm" style={{ color: message.includes("Error") ? "#B4573D" : "#5C7A52" }}>
            {message}
          </p>
        )}

        {/* Danger Zone */}
        <div className="p-6 rounded-3xl space-y-3" style={{ ...cardStyle, border: "1px solid #E9B9A8" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "#B4573D" }}>
            Danger Zone
          </h2>
          <p className="text-sm" style={{ color: "#A68880" }}>
            Ye sab appointments permanently delete kar dega. Salon profile aur services safe rahenge.
          </p>
          <button
            onClick={handleResetAppointments}
            disabled={resetting}
            className="px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            style={
              confirmReset
                ? { backgroundColor: "#B4573D", color: "white", border: "1px solid #B4573D" }
                : { color: "#B4573D", border: "1px solid #E9B9A8", backgroundColor: "transparent" }
            }
          >
            {resetting
              ? "Deleting..."
              : confirmReset
              ? "Pakka delete karna hai? Click to confirm"
              : "Reset All Appointments"}
          </button>
          {resetMessage && (
            <p className="text-sm" style={{ color: "#8A6F6A" }}>{resetMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}