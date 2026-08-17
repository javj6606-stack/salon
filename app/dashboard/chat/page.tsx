"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export default function WhatsAppChatPage() {
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<any>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  async function loadConversations() {
    const { data: convos } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });
    setConversations(convos || []);
  }

  async function loadMessages(conversationId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  useEffect(() => {
    async function init() {
      const { data: cred } = await supabase
        .from("whatsapp_credentials")
        .select("id")
        .eq("status", "connected")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cred) setSessionId(cred.id);

      await loadConversations();
    }
    init();

    const interval = setInterval(async () => {
      await loadConversations();
      if (selectedRef.current) {
        await loadMessages(selectedRef.current.id);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function openConversation(convo: any) {
    setSelected(convo);
    await loadMessages(convo.id);
  }

  async function sendReply() {
    if (!selected || !sessionId || !reply.trim()) return;

    const textToSend = reply;
    setReply("");

    await fetch(`http://localhost:4000/send/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: selected.customer_number, text: textToSend }),
    });

    setTimeout(() => loadMessages(selected.id), 500);
  }

  function formatTime(timestamp: string) {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function senderLabel(sender: string) {
    if (sender === "customer") return "Customer";
    if (sender === "ai") return "AI";
    return "Aap";
  }

  const panelStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.8)",
    border: "1px solid #F0DDD3",
    boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
  };

  return (
    <div className="min-h-screen p-8">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#C6707A" }}>
        Conversations
      </p>
      <h1 className="font-display mt-2 mb-6 text-4xl" style={{ fontWeight: 700, color: "#3B2A2E" }}>
        WhatsApp Chat
      </h1>

      <div className="flex h-[75vh] gap-5">
        <div className="w-1/3 rounded-3xl overflow-y-auto" style={panelStyle}>
          <h2
            className="font-display font-bold p-4"
            style={{ borderBottom: "1px solid #F0DDD3", color: "#3B2A2E" }}
          >
            Conversations
          </h2>
          {conversations.length === 0 && (
            <p className="p-4 text-sm" style={{ color: "#C7B3AC" }}>
              Abhi koi conversation nahi hai
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => openConversation(c)}
              className="p-4 cursor-pointer transition-colors"
              style={{
                borderBottom: "1px solid #F5E8E1",
                backgroundColor: selected?.id === c.id ? "#F6E1E4" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (selected?.id !== c.id) e.currentTarget.style.backgroundColor = "#FBF3EE";
              }}
              onMouseLeave={(e) => {
                if (selected?.id !== c.id) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <p className="font-medium" style={{ color: "#3B2A2E" }}>
                {c.customer_name || c.customer_number}
              </p>
              <p className="text-sm truncate" style={{ color: "#A68880" }}>
                {c.last_message}
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1 rounded-3xl flex flex-col" style={panelStyle}>
          {selected ? (
            <>
              <div
                className="p-4 font-medium font-display"
                style={{ borderBottom: "1px solid #F0DDD3", color: "#3B2A2E" }}
              >
                {selected.customer_name || selected.customer_number}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={m.id || i}
                    className={`max-w-xs ${m.sender === "salon" || m.sender === "ai" ? "ml-auto" : ""}`}
                  >
                    <div
                      className="p-3 rounded-2xl"
                      style={{
                        backgroundColor:
                          m.sender === "salon" || m.sender === "ai" ? "#F6E1E4" : "#F3ECE8",
                        color: "#3B2A2E",
                      }}
                    >
                      {m.content}
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        m.sender === "salon" || m.sender === "ai" ? "text-right" : ""
                      }`}
                      style={{ color: "#C7B3AC" }}
                    >
                      {senderLabel(m.sender)} · {formatTime(m.created_at)}
                    </p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 flex gap-2" style={{ borderTop: "1px solid #F0DDD3" }}>
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  className="rounded-xl p-2 flex-1 border focus:outline-none focus:ring-2 transition-colors"
                  style={{ borderColor: "#E9D6CC", ["--tw-ring-color" as any]: "#C6707A" }}
                  placeholder="Reply likho..."
                />
                <button
                  onClick={sendReply}
                  className="text-white px-4 rounded-xl transition-colors"
                  style={{ backgroundColor: "#C6707A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B85C6B")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C6707A")}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="p-6" style={{ color: "#A68880" }}>
              Koi conversation select karo
            </p>
          )}
        </div>
      </div>
    </div>
  );
}