"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { apiPost } from "@/lib/apiClient";

type RequestType = "nda" | "info" | "partnership" | "other";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [requestNda, setRequestNda] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("info");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await apiPost("/api/contact", {
        name,
        email,
        message,
        requestNda,
        requestType,
      });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">تواصل</h1>
      <p className="mt-2 text-slate-600">
        أرسل استفسارك أو اطلب اتفاقية عدم إفصاح.
      </p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              الاسم الكامل
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="requestType" className="block text-sm font-medium text-slate-700">
              نوع الطلب
            </label>
            <select
              id="requestType"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequestType)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="info">معلومات عامة</option>
              <option value="nda">طلب اتفاقية عدم إفصاح</option>
              <option value="partnership">استفسار شراكة</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700">
              الرسالة
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="requestNda"
              type="checkbox"
              checked={requestNda}
              onChange={(e) => setRequestNda(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="requestNda" className="text-sm text-slate-700">
              أود طلب اتفاقية عدم إفصاح
            </label>
          </div>
          {status === "success" && (
            <p className="text-sm text-green-600">شكراً لك. تم إرسال رسالتك بنجاح.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">حدث خطأ. يرجى المحاولة مرة أخرى.</p>
          )}
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "جاري الإرسال..." : "إرسال"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
