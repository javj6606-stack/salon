"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function WhatsAppPage() {
  const supabase = createClient();

  const [status, setStatus] = useState<"not_connected" | "pending" | "connected">("not_connected");
  const [mode, setMode] = useState<"choose" | "qr" | "api_key">("choose");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const [provider, setProvider] = useState("meta");
  const [apiKey, setApiKey] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  const [qrImage, setQrImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      const { data } = await supabase.from("whatsapp_credentials").select("id, status").maybeSingle();
      if (data) {
        setStatus(data.status as any);
        setSessionId(data.id);
      }
      setLoading(false);
    }
    fetchStatus();
  }, []);

  async function handleApiKeySubmit() {
    await supabase.from("whatsapp_credentials").upsert({
      connection_type: "api_key",
      provider,
      api_key: apiKey,
      phone_number_id: phoneNumberId,
      base_url: baseUrl || null,
      status: "connected",
    });
    setStatus("connected");
  }

  async function handleQrConnect() {
    const { data: existing } = await supabase
      .from("whatsapp_credentials")
      .select("id")
      .eq("connection_type", "qr")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let id;
    if (existing) {
      id = existing.id;
      await supabase.from("whatsapp_credentials").update({ status: "pending" }).eq("id", id);
    } else {
      const { data } = await supabase
        .from("whatsapp_credentials")
        .insert({ connection_type: "qr", status: "pending" })
        .select()
        .single();
      id = data.id;
    }

    setSessionId(id);

    await fetch(`http://localhost:4000/connect/${id}`, { method: "POST" });

    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:4000/status/${id}`);
      const result = await res.json();

      if (result.qr) setQrImage(result.qr);
      if (result.status === "connected") {
        setStatus("connected");
        clearInterval(interval);
      }
    }, 2000);
  }

  async function handleReset() {
    if (!sessionId) return;
    setResetting(true);

    try {
      await fetch(`http://localhost:4000/disconnect/${sessionId}`, { method: "POST" });
    } catch (e) {
      console.log("Backend disconnect call fail hui:", e);
    }

    await supabase
      .from("whatsapp_credentials")
      .update({ status: "not_connected" })
      .eq("id", sessionId);

    setStatus("not_connected");
    setMode("choose");
    setQrImage(null);
    setResetting(false);
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.8)",
    border: "1px solid #F0DDD3",
    boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
  };
  const inputStyle =
    "border rounded-xl p-2 w-full focus:outline-none focus:ring-2 transition-colors";
  const inputBorderStyle = { borderColor: "#E9D6CC", ["--tw-ring-color" as any]: "#C6707A" } as React.CSSProperties;

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
        Automation
      </p>
      <h1 className="font-display mt-2 mb-8 text-4xl" style={{ fontWeight: 700, color: "#3B2A2E" }}>
        WhatsApp Integration
      </h1>

      {status === "connected" && (
        <div className="mb-6 p-5 rounded-2xl max-w-md" style={cardStyle}>
          <p className="mb-3 font-medium" style={{ color: "#5C7A52" }}>✅ WhatsApp connected</p>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{ border: "1px solid #E9B9A8", color: "#B4573D" }}
            onMouseEnter={(e) => !resetting && (e.currentTarget.style.backgroundColor = "#F7DED7")}
            onMouseLeave={(e) => !resetting && (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {resetting ? "Reset ho raha hai..." : "🔄 Connection Reset Karo"}
          </button>
        </div>
      )}

      {status === "pending" && (
        <div className="mb-6 p-5 rounded-2xl max-w-md" style={cardStyle}>
          <p className="mb-3 font-medium" style={{ color: "#8A6A2F" }}>Connection setup baaki hai...</p>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{ border: "1px solid #E9B9A8", color: "#B4573D" }}
            onMouseEnter={(e) => !resetting && (e.currentTarget.style.backgroundColor = "#F7DED7")}
            onMouseLeave={(e) => !resetting && (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {resetting ? "Reset ho raha hai..." : "🔄 Connection Reset Karo"}
          </button>
        </div>
      )}

      {status === "not_connected" && mode === "choose" && (
        <div className="grid grid-cols-2 gap-5 max-w-3xl">
          <button
            onClick={() => setMode("qr")}
            className="rounded-2xl p-6 text-left transition-colors"
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C6707A")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F0DDD3")}
          >
            <h3 className="font-display font-bold mb-2" style={{ color: "#3B2A2E" }}>📱 QR Code se Connect</h3>
            <p className="text-sm" style={{ color: "#8A6F6A" }}>
              Apne phone se QR scan karein — sabse asaan tareeqa, koi API key nahi chahiye.
            </p>
          </button>

          <button
            onClick={() => setMode("api_key")}
            className="rounded-2xl p-6 text-left transition-colors"
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C6707A")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F0DDD3")}
          >
            <h3 className="font-display font-bold mb-2" style={{ color: "#3B2A2E" }}>🔑 API Key se Connect</h3>
            <p className="text-sm" style={{ color: "#8A6F6A" }}>
              Meta Cloud API, Green API, Twilio ya kisi bhi provider ki credentials daal ke connect karein.
            </p>
          </button>
        </div>
      )}

      {status === "not_connected" && mode === "qr" && (
        <div className="rounded-2xl p-6 max-w-md" style={cardStyle}>
          <p className="mb-4" style={{ color: "#8A6F6A" }}>
            Neeche button dabao, QR code aayega — apne WhatsApp se scan kar lena.
          </p>
          <button
            onClick={handleQrConnect}
            className="text-white px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: "#C6707A" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B85C6B")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C6707A")}
          >
            Generate QR Code
          </button>

          {qrImage && (
            <img
              src={qrImage}
              alt="Scan this QR"
              className="w-64 h-64 mt-4 rounded-xl"
              style={{ border: "1px solid #F0DDD3" }}
            />
          )}

          <div>
            <button onClick={() => setMode("choose")} className="mt-3 text-sm" style={{ color: "#A68880" }}>
              Wapas jao
            </button>
          </div>
        </div>
      )}

      {status === "not_connected" && mode === "api_key" && (
        <div className="rounded-2xl p-6 space-y-3 max-w-md" style={cardStyle}>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={inputStyle}
            style={inputBorderStyle}
          >
            <option value="meta">Meta Cloud API</option>
            <option value="green_api">Green API</option>
            <option value="twilio">Twilio</option>
            <option value="other">Other</option>
          </select>

          <input
            placeholder="API Key / Access Token"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={inputStyle}
            style={inputBorderStyle}
          />
          <input
            placeholder="Phone Number ID / Instance ID"
            value={phoneNumberId}
            onChange={(e) => setPhoneNumberId(e.target.value)}
            className={inputStyle}
            style={inputBorderStyle}
          />
          <input
            placeholder="Base URL (optional, sirf kuch providers ke liye)"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className={inputStyle}
            style={inputBorderStyle}
          />

          <button
            onClick={handleApiKeySubmit}
            className="text-white px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: "#C6707A" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B85C6B")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C6707A")}
          >
            Connect
          </button>
          <button onClick={() => setMode("choose")} className="ml-3 text-sm" style={{ color: "#A68880" }}>
            Wapas jao
          </button>
        </div>
      )}
    </div>
  );
}