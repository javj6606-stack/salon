"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Service {
  name: string;
  price: string;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salonName, setSalonName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [services, setServices] = useState<Service[]>([{ name: "", price: "" }]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("salons")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSalonName(data.salon_name || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
        setOpeningTime(data.opening_time || "");
        setClosingTime(data.closing_time || "");
        setServices(data.services?.length ? data.services : [{ name: "", price: "" }]);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, { name: "", price: "" }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("User not found. Please login again.");
      setSaving(false);
      return;
    }

    const cleanedServices = services.filter((s) => s.name.trim() !== "");

    const { error } = await supabase
      .from("salons")
      .upsert(
        {
          user_id: user.id,
          salon_name: salonName,
          address,
          phone,
          opening_time: openingTime,
          closing_time: closingTime,
          services: cleanedServices,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      setMessage("Error saving: " + error.message);
    } else {
      setMessage("Profile saved successfully! ✅");
    }
    setSaving(false);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.8)",
    border: "1px solid #F0DDD3",
    boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
  };
  const inputStyle =
    "w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 transition-colors";
  const inputBorderStyle = { borderColor: "#E9D6CC", ["--tw-ring-color" as any]: "#C6707A" } as React.CSSProperties;
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
        Salon Profile
      </h1>

      <div className="max-w-2xl">
        <div className="space-y-5 p-6 rounded-3xl" style={cardStyle}>
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>
              Salon Name
            </label>
            <input
              type="text"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              className={inputStyle}
              style={inputBorderStyle}
              placeholder="e.g. Glowly Beauty Salon"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputStyle}
              style={inputBorderStyle}
              placeholder="e.g. Block 6, PECHS, Karachi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputStyle}
              style={inputBorderStyle}
              placeholder="e.g. 0300-1234567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                Opening Time
              </label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                Closing Time
              </label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={labelStyle}>
              Services
            </label>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                    placeholder="e.g. Haircut"
                    className={`flex-1 ${inputStyle}`}
                    style={inputBorderStyle}
                  />
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                    placeholder="e.g. 500"
                    className={`w-28 ${inputStyle}`}
                    style={inputBorderStyle}
                  />
                  <button
                    onClick={() => removeService(index)}
                    className="px-3 rounded-xl transition-colors"
                    style={{ color: "#B4573D" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F7DED7")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addService}
              className="mt-2 text-sm font-medium hover:underline"
              style={{ color: "#C6707A" }}
            >
              + Add Service
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#C6707A" }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = "#B85C6B")}
            onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = "#C6707A")}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p className="text-sm" style={{ color: message.includes("Error") ? "#B4573D" : "#5C7A52" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}