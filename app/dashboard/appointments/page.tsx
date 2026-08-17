"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Service {
  name: string;
  price: string;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FBF0DF", text: "#8A6A2F" },
  confirmed: { bg: "#F6E1E4", text: "#B85C6B" },
  completed: { bg: "#E7EFE3", text: "#5C7A52" },
  cancelled: { bg: "#F7DED7", text: "#B4573D" },
};

export default function AppointmentsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: salonData } = await supabase
      .from("salons")
      .select("services")
      .eq("user_id", user.id)
      .single();

    if (salonData?.services) {
      setServices(salonData.services);
    }

    const { data: appts } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (appts) {
      setAppointments(appts);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAppointment = async () => {
    if (!customerName || !appointmentDate || !appointmentTime) {
      setMessage("Naam, date aur time zaroori hain");
      return;
    }

    setSaving(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      service_name: serviceName,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: "pending",
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Appointment add ho gayi! ✅");
      setCustomerName("");
      setCustomerPhone("");
      setServiceName("");
      setAppointmentDate("");
      setAppointmentTime("");
      loadData();
    }
    setSaving(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("appointments").delete().eq("id", id);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <p style={{ color: "#8A6F6A" }}>Loading...</p>
      </div>
    );
  }

  const inputStyle =
    "border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 transition-colors";
  const inputBorderStyle = { borderColor: "#E9D6CC" } as React.CSSProperties;

  return (
    <div className="min-h-screen p-8">
      <p
        className="text-xs font-semibold tracking-[0.2em] uppercase"
        style={{ color: "#C6707A" }}
      >
        Bookings
      </p>
      <h1
        className="font-display mt-2 mb-8 text-4xl"
        style={{ fontWeight: 700, color: "#3B2A2E" }}
      >
        Appointments
      </h1>

      {/* Add Appointment Form */}
      <div
        className="p-6 rounded-3xl mb-8 max-w-3xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid #F0DDD3",
          boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
        }}
      >
        <h2 className="font-display text-lg mb-4" style={{ color: "#3B2A2E", fontWeight: 600 }}>
          Nayi Appointment Add Karo
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputStyle}
            style={{ ...inputBorderStyle, ["--tw-ring-color" as any]: "#C6707A" }}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className={inputStyle}
            style={{ ...inputBorderStyle, ["--tw-ring-color" as any]: "#C6707A" }}
          />
          <select
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className={inputStyle}
            style={{ ...inputBorderStyle, ["--tw-ring-color" as any]: "#C6707A" }}
          >
            <option value="">Service Select Karo</option>
            {services.map((s, i) => (
              <option key={i} value={s.name}>
                {s.name} {s.price ? `- Rs ${s.price}` : ""}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className={`flex-1 ${inputStyle}`}
              style={{ ...inputBorderStyle, ["--tw-ring-color" as any]: "#C6707A" }}
            />
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className={`flex-1 ${inputStyle}`}
              style={{ ...inputBorderStyle, ["--tw-ring-color" as any]: "#C6707A" }}
            />
          </div>
        </div>
        <button
          onClick={handleAddAppointment}
          disabled={saving}
          className="text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#C6707A" }}
          onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = "#B85C6B")}
          onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = "#C6707A")}
        >
          {saving ? "Adding..." : "+ Add Appointment"}
        </button>
        {message && (
          <p
            className="mt-3 text-sm"
            style={{ color: message.includes("Error") ? "#B4573D" : "#5C7A52" }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Appointments List */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid #F0DDD3",
          boxShadow: "0 10px 30px rgba(198, 112, 122, 0.10)",
        }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#FBF3EE", borderBottom: "1px solid #F0DDD3" }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#A68880" }}>Customer</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#A68880" }}>Service</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#A68880" }}>Date</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#A68880" }}>Time</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#A68880" }}>Status</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#A68880" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8" style={{ color: "#C7B3AC" }}>
                  Koi appointment nahi hai abhi
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id} style={{ borderBottom: "1px solid #F5E8E1" }}>
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: "#3B2A2E" }}>{appt.customer_name}</div>
                    <div className="text-xs" style={{ color: "#C7B3AC" }}>{appt.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#5A4844" }}>{appt.service_name || "-"}</td>
                  <td className="px-4 py-3" style={{ color: "#5A4844" }}>{appt.appointment_date}</td>
                  <td className="px-4 py-3" style={{ color: "#5A4844" }}>{appt.appointment_time}</td>
                  <td className="px-4 py-3">
                    <select
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className="text-xs px-3 py-1.5 rounded-full border-0 font-medium focus:outline-none"
                      style={{
                        backgroundColor: statusStyles[appt.status]?.bg || "#F5E8E1",
                        color: statusStyles[appt.status]?.text || "#5A4844",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(appt.id)}
                      className="hover:underline text-xs"
                      style={{ color: "#B4573D" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}