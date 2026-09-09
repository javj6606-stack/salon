"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "meta" | "provider" | "custom";

const WHATSAPP_SERVICE_URL = process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL;

export default function WhatsAppPage() {
  const supabase = createClient();

  const [status, setStatus] = useState<"not_connected" | "pending" | "connected">("not_connected");
  const [mode, setMode] = useState<"choose" | "connect">("choose");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [provider, setProvider] = useState<Provider>("meta");
  const [apiKey, setApiKey] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [webhookSecret, setWebhookSecret] = useState<string | null>(null);
  const [connectedProvider, setConnectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("whatsapp_credentials")
        .select("id, status, provider, webhook_secret")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setStatus((data.status as any) || "not_connected");
        setSessionId(data.id);
        setWebhookSecret(data.webhook_secret);
        setConnectedProvider(data.provider as Provider | null);
      }
      setLoading(false);
    }
    fetchStatus();
  }, []);

  async function handleSubmit() {
    setError(null);

    if (provider === "meta" && (!apiKey || !phoneNumberId)) {
      setError("Access Token aur Phone Number ID dono zaroori hain.");
      return;
    }
    if ((provider === "provider" || provider === "custom") && (!apiKey || !baseUrl)) {
      setError("API Key aur Base URL dono zaroori hain.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { data: existing } = await supabase
      .from("whatsapp_credentials")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const payload = {
      provider,
      api_key: apiKey,
      phone_number_id: provider === "meta" ? phoneNumberId : null,
      base_url: provider !== "meta" ? baseUrl : null,
      status: "connected" as const,
    };

    let id = existing?.id;
    if (existing) {
      await supabase.from("whatsapp_credentials").update(payload).eq("id", existing.id);
    } else {
      const { data } = await supabase
        .from("whatsapp_credentials")
        .insert({ user_id: user.id, ...payload })
        .select()
        .single();
      id = data?.id;
    }

    // webhook_secret naya row banne pe DB default se generate ho chuki hoti hai — dobara fetch karo
    const { data: fresh } = await supabase
      .from("whatsapp_credentials")
      .select("id, webhook_secret, provider")
      .eq("id", id)
      .maybeSingle();

    setSessionId(fresh?.id || id || null);
    setWebhookSecret(fresh?.webhook_secret || null);
    setConnectedProvider(provider);
    setStatus("connected");
    setSaving(false);
  }

  async function handleReset() {
    if (!sessionId) return;
    setResetting(true);

    await supabase.from("whatsapp_credentials").update({ status: "not_connected" }).eq("id", sessionId);

    setStatus("not_connected");
    setMode("choose");
    setApiKey("");
    setPhoneNumberId("");
    setBaseUrl("");
    setResetting(false);
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.8)",
    border: "1px solid #F0DDD3",
    boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
  };
  const inputStyle = "border rounded-xl p-2 w-full focus:outline-none focus:ring-2 transition-colors";
  const inputBorderStyle = { borderColor: "#E9D6CC", ["--tw-ring-color" as any]: "#C6707A" } as React.CSSProperties;

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <p style={{ color: "#8A6F6A" }}>Loading...</p>
      </div>
    );
  }

  const webhookUrlFor = (p: Provider) =>
    `${WHATSAPP_SERVICE_URL}/webhook/${p === "meta" ? "meta" : p}${p === "meta" ? "" : `/${sessionId}`}`;

  return (
    <div className="min-h-screen p-8">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#C6707A" }}>
        Automation
      </p>
      <h1 className="font-display mt-2 mb-8 text-4xl" style={{ fontWeight: 700, color: "#3B2A2E" }}>
        WhatsApp Integration
      </h1>

      {status === "connected" && (
        <div className="mb-6 p-5 rounded-2xl max-w-lg" style={cardStyle}>
          <p className="mb-3 font-medium" style={{ color: "#5C7A52" }}>
            ✅ WhatsApp connected ({connectedProvider === "meta" ? "Meta Cloud API" : connectedProvider === "provider" ? "Provider API" : "Custom API"})
          </p>

          {connectedProvider && connectedProvider !== "meta" && sessionId && webhookSecret && (
            <div className="mb-4 p-3 rounded-xl text-xs" style={{ backgroundColor: "#FBF3EE", color: "#5C4A45" }}>
              <p className="font-semibold mb-1">Apne provider ki webhook settings mein ye daalo:</p>
              <p className="mb-1">
                URL: <code className="break-all">{webhookUrlFor(connectedProvider)}</code>
              </p>
              <p>
                Header: <code>X-Webhook-Secret: {webhookSecret}</code>
              </p>
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{ border: "1px solid #E9B9A8", color: "#B4573D" }}
          >
            {resetting ? "Reset ho raha hai..." : "🔄 Connection Reset Karo"}
          </button>
        </div>
      )}

      {status === "not_connected" && mode === "choose" && (
        <button
          onClick={() => setMode("connect")}
          className="rounded-2xl p-6 text-left transition-colors max-w-md"
          style={cardStyle}
        >
          <h3 className="font-display font-bold mb-2" style={{ color: "#3B2A2E" }}>
            🔑 WhatsApp API se Connect Karo
          </h3>
          <p className="text-sm" style={{ color: "#8A6F6A" }}>
            Meta Cloud API (official), koi third-party provider (jaise WATI), ya apna custom backend use karo.
          </p>
        </button>
      )}

      {status === "not_connected" && mode === "connect" && (
        <div className="rounded-2xl p-6 space-y-3 max-w-md" style={cardStyle}>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
            className={inputStyle}
            style={inputBorderStyle}
          >
            <option value="meta">Meta Cloud API (official, recommended)</option>
            <option value="provider">Provider API (e.g. WATI)</option>
            <option value="custom">Custom API</option>
          </select>

          {provider === "meta" && (
            <>
              <input
                placeholder="Access Token"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
              />
              <input
                placeholder="Phone Number ID"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
              />
            </>
          )}

          {(provider === "provider" || provider === "custom") && (
            <>
              <input
                placeholder="Base URL (e.g. https://live-server.wati.io)"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
              />
              <input
                placeholder="API Key / Access Token"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={inputStyle}
                style={inputBorderStyle}
              />
            </>
          )}

          {error && (
            <p className="text-sm" style={{ color: "#B4573D" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#C6707A" }}
          >
            {saving ? "Connect ho raha hai..." : "Connect"}
          </button>
          <button onClick={() => setMode("choose")} className="ml-3 text-sm" style={{ color: "#A68880" }}>
            Wapas jao
          </button>
        </div>
      )}
    </div>
  );
}