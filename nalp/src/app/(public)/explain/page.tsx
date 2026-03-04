"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ExplainZone = "A" | "B" | "C" | "D" | "ALL";
export type ExplainAudience = "INVESTOR" | "OPERATOR" | "PUBLIC";
export type ExplainLanguage = "AR" | "EN";
export type ExplainDuration = "30s" | "60s" | "90s" | "3min";
export type ExplainStyle = "EXPLAINER" | "PITCH" | "TECHNICAL" | "STORY";
export type ExplainStatus = "DRAFT" | "PRODUCED" | "PUBLISHED";

export interface ExplainAsset {
  id: string;
  createdAt: string;
  title: string;
  zone: ExplainZone;
  audience: ExplainAudience;
  language: ExplainLanguage;
  duration: ExplainDuration;
  style: ExplainStyle;
  includeNumbers: boolean;
  prompt: string;
  videoUrl?: string;
  status: ExplainStatus;
  notes?: string;
}

const STORAGE_KEY = "nalp_explain_assets_v1";

// ─── LocalStorage helpers ──────────────────────────────────────────────────

function loadAssets(): ExplainAsset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveAssets(list: ExplainAsset[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore write errors
  }
}

function upsertAsset(asset: ExplainAsset): void {
  const current = loadAssets();
  const idx = current.findIndex((a) => a.id === asset.id);
  const next =
    idx === -1
      ? [asset, ...current]
      : current.map((a) => (a.id === asset.id ? asset : a));
  saveAssets(next);
}

function deleteAsset(id: string): void {
  const current = loadAssets();
  const next = current.filter((a) => a.id !== id);
  saveAssets(next);
}

// ─── Prompt Builder helpers ────────────────────────────────────────────────

interface PromptOptions {
  zone: ExplainZone;
  audience: ExplainAudience;
  language: ExplainLanguage;
  duration: ExplainDuration;
  style: ExplainStyle;
  includeNumbers: boolean;
}

function buildPrompt(opts: PromptOptions): string {
  const { zone, audience, language, duration, style, includeNumbers } = opts;
  const isAr = language === "AR";

  const isLong =
    duration === "60s" || duration === "90s" || duration === "3min";

  const audienceLabel = (() => {
    if (isAr) {
      if (audience === "INVESTOR") return "للمستثمر المالي";
      if (audience === "OPERATOR") return "لمشغل المشروع";
      return "للجمهور العام";
    }
    if (audience === "INVESTOR") return "for a financial investor";
    if (audience === "OPERATOR") return "for the project operator";
    return "for the general public";
  })();

  const styleLabel = (() => {
    if (isAr) {
      if (style === "EXPLAINER") return "فيديو توضيحي بسيط";
      if (style === "PITCH") return "فيديو Pitch للمستثمر";
      if (style === "TECHNICAL") return "شرح تقني منظم";
      return "قصة قصيرة تحكي الفكرة";
    }
    if (style === "EXPLAINER") return "simple explainer video";
    if (style === "PITCH") return "investor pitch video";
    if (style === "TECHNICAL") return "structured technical explanation";
    return "short story-style narrative";
  })();

  // Zone-specific content
  const zoneIntro = (() => {
    if (isAr) {
      switch (zone) {
        case "A":
          return includeNumbers
            ? "شرح منطقة المزاد (Zone-A) كنظام عمولات يعتمد على عدد السيارات ومتوسط العمولة، مع 100 ريال لكل سيارة قبل التعادل، ثم 50٪ من صافي الربح بعد المصاريف لملاك الأرض بعد التعادل."
            : "شرح منطقة المزاد (Zone-A) كنظام عمولات يعتمد على عدد السيارات ومتوسط العمولة، مع مبلغ ثابت لكل سيارة قبل التعادل، ثم نسبة ثابتة من صافي الربح بعد المصاريف لملاك الأرض بعد التعادل.";
        case "B":
        case "C":
        case "D":
          return includeNumbers
            ? "شرح Waterfall من ثلاث طبقات: استرداد رأس المال، عائد تفضيلي 10٪ سنويًا على رأس المال غير المسترد، ثم توزيع متبقٍ 40٪ لملاك الأرض، 40٪ للمستثمر، 20٪ للمشغل."
            : "شرح Waterfall من ثلاث طبقات: استرداد رأس المال أولاً، ثم عائد تفضيلي على رأس المال غير المسترد، ثم توزيع متبقٍ بين ملاك الأرض والمستثمر والمشغل وفق نسب ثابتة.";
        case "ALL":
          return includeNumbers
            ? "شرح النظام الكامل للمناطق: Zone-A بنموذج 100 ريال لكل سيارة قبل التعادل و50٪ من الربح بعد المصاريف بعد التعادل، والمناطق B/C/D بنموذج Waterfall من ثلاث طبقات (استرداد رأس المال، 10٪ عائد تفضيلي، ثم 40/40/20 متبقٍ)."
            : "شرح النظام الكامل للمناطق: Zone-A بنموذج قبل/بعد التعادل، والمناطق B/C/D بنموذج Waterfall من ثلاث طبقات دون الدخول في أرقام محددة.";
      }
    } else {
      switch (zone) {
        case "A":
          return includeNumbers
            ? "Explain Zone-A as the auction commission engine: revenue scales with car volume and average commission, with a 100 SAR per car rule pre-breakeven and a 50% landowner share of profit-after-OPEX post-breakeven."
            : "Explain Zone-A as the auction commission engine: revenue scales with car volume and average commission, with a fixed per-car amount pre-breakeven and a fixed share of profit-after-OPEX for landowners post-breakeven.";
        case "B":
        case "C":
        case "D":
          return includeNumbers
            ? "Explain a 3-layer waterfall: (1) Return of Capital, (2) a 10% preferred return on unreturned capital, and (3) a residual split 40% land, 40% investor, 20% operator."
            : "Explain a 3-layer waterfall: (1) Return of Capital, (2) a preferred return on unreturned capital, and (3) a residual split between land, investor, and operator.";
        case "ALL":
          return includeNumbers
            ? "Explain the full system: Zone-A with its 100 SAR per car pre-breakeven and 50% land share after OPEX post-breakeven, and Zones B/C/D using a 3-layer waterfall (Return of Capital, 10% preferred return, 40/40/20 residual split)."
            : "Explain the full system: Zone-A with a clear pre/post-breakeven rule, and Zones B/C/D using a 3-layer waterfall structure without going deep into exact numbers.";
      }
    }
  })();

  const script = (() => {
    if (isAr) {
      return [
        `المطلوب: ${styleLabel} ${audienceLabel} عن ${zone === "ALL" ? "محرك العوائد للمناطق A/B/C/D" : "منطقة " + zone}.`,
        "",
        "Script (التعليق الصوتي):",
        `1) مقدمة سريعة عن مشروع NALP ومحرك العوائد للمناطق (${zone === "ALL" ? "A/B/C/D" : zone}).`,
        `2) توضيح الفكرة الأساسية: ${zoneIntro}`,
        includeNumbers
          ? "3) ذكر الأرقام بشكل مبسط دون تعقيد، مع التركيز على العلاقة بين المخاطرة والعائد."
          : "3) التركيز على المنطق وطريقة التوزيع بدون الدخول في تفاصيل رقمية دقيقة.",
        "4) إنهاء بمعلومة أن كل الأرقام المعرّضة مشتقة مباشرة من Financial Engine والـ Financial Canon.",
      ].join("\n");
    }

    return [
      `Goal: ${styleLabel} ${audienceLabel} about ${zone === "ALL" ? "the NALP multi-zone returns engine (A/B/C/D)" : "Zone-" + zone}.`,
      "",
      "Script (voiceover):",
      `1) Open with a 1-sentence overview of NALP and how the returns engine works for zone(s) ${zone === "ALL" ? "A/B/C/D" : zone}.`,
      `2) Explain the core idea: ${zoneIntro}`,
      includeNumbers
        ? "3) Use simple numbers to illustrate the mechanics, focusing on risk/reward and how investors and landowners participate."
        : "3) Focus on the logic and flow of value (who gets paid, in which order) without quoting specific numbers.",
      "4) Close with a clear statement that all figures are derived from the Financial Engine and governed by the Financial Canon.",
    ].join("\n");
  })();

  const onScreen = (() => {
    if (isAr) {
      return [
        "On-screen text (نص على الشاشة):",
        "- عنوان: محرك العوائد للمناطق (Explain Engine).",
        zone === "A"
          ? "- نقاط: قبل التعادل (مبلغ ثابت لكل سيارة) / بعد التعادل (نسبة من الربح بعد المصاريف لملاك الأرض)."
          : zone === "ALL"
          ? "- نقاط: Zone-A (قبل/بعد التعادل) + Waterfall للمناطق B/C/D."
          : "- نقاط: ثلاث طبقات للتوزيع: استرداد رأس المال → عائد تفضيلي → توزيع متبقٍ.",
        "- سطر توضيحي: كل الأرقام مشتقة آليًا من Financial Engine.",
      ].join("\n");
    }
    return [
      "On-screen text cues:",
      "- Title: NALP Returns Engine (Zones).",
      zone === "A"
        ? "- Bullets: Pre-breakeven = per-car rule / Post-breakeven = % of profit-after-OPEX."
        : zone === "ALL"
        ? "- Bullets: Zone-A pre/post breakeven + B/C/D 3-layer waterfall."
        : "- Bullets: 3 layers: Return of Capital → Preferred Return → Residual Split.",
      "- Footer: All numbers are engine-derived (Financial Canon).",
    ].join("\n");
  })();

  const shots = (() => {
    const baseShort = isAr
      ? [
          "1) لقطة خارجية للمشروع مع عنوان بسيط على الشاشة.",
          "2) لقطة توضيحية لمخطط المناطق A/B/C/D مع إبراز المنطقة المستهدفة.",
          "3) لقطة لجدول مبسط أو مخطط يوضّح تدفق العوائد.",
        ]
      : [
          "1) Wide shot of the NALP site with a simple title overlay.",
          "2) Diagram shot showing Zones A/B/C/D, highlighting the target zone(s).",
          "3) Simple chart or diagram showing how cash flows through the engine.",
        ];

    const extended = isAr
      ? [
          ...baseShort,
          "4) لقطة تفصيلية لخطوات Layer 1 / Layer 2 / Layer 3 بشكل بسيط.",
          "5) لقطة نصية تبيّن دور المستثمر مقابل ملاك الأرض والمشغل.",
          "6) لقطة ختامية مع سطر: الأرقام مشتقة من Financial Canon.",
        ]
      : [
          ...baseShort,
          "4) Close-up explaining Layer 1 / Layer 2 / Layer 3 with simple icons.",
          "5) Overlay showing roles: Landowner vs Investor vs Operator.",
          "6) Closing shot with a line: Figures derived from the Financial Canon.",
        ];

    return isLong ? extended : baseShort;
  })();

  return [script, "", onScreen, "", "Shot list:", ...shots].join("\n");
}

// Extract simple on-screen cues (lines that look like bullets or mention On-screen)
function extractOnScreenCues(prompt: string): string[] {
  return prompt
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        !!l &&
        (l.toLowerCase().includes("on-screen") ||
          l.toLowerCase().includes("on-screen text") ||
          l.startsWith("- ") ||
          l.startsWith("•"))
    );
}

// Build a basic shot list from numbered lines (e.g. "1) ...")
function extractShotList(
  prompt: string,
  duration: ExplainDuration
): { scene: string; visual: string; onScreenText: string; durationSec: number }[] {
  const lines = prompt.split("\n").map((l) => l.trim());
  const shotLines = lines.filter((l) => /^\d+\)/.test(l));

  const perScene =
    duration === "30s" ? 5 : duration === "60s" ? 10 : duration === "90s" ? 12 : 20;

  return shotLines.map((line, idx) => {
    const visual = line.replace(/^\d+\)\s*/, "");
    return {
      scene: `Scene ${idx + 1}`,
      visual,
      onScreenText: "",
      durationSec: perScene,
    };
  });
}

function formatVttTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const ms = 0;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(3, "0")}`;
}

// Very simple VTT captions from script sentences
function buildVttCaptions(script: string): string {
  const sentences = script
    .split(/(?<=[\.!\?؟])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lines: string[] = ["WEBVTT", ""];
  let t = 0;
  const perSentence = 3;

  sentences.forEach((sentence, idx) => {
    const start = t;
    const end = t + perSentence;
    lines.push(
      String(idx + 1),
      `${formatVttTime(start)} --> ${formatVttTime(end)}`,
      sentence,
      ""
    );
    t = end;
  });

  return lines.join("\n");
}

// ─── Page Component ────────────────────────────────────────────────────────

type TabId = "PROMPT" | "LIBRARY";

export default function ExplainPage() {
  const [activeTab, setActiveTab] = useState<TabId>("PROMPT");

  // Prompt builder state
  const [zone, setZone] = useState<ExplainZone>("A");
  const [audience, setAudience] = useState<ExplainAudience>("INVESTOR");
  const [language, setLanguage] = useState<ExplainLanguage>("AR");
  const [duration, setDuration] = useState<ExplainDuration>("60s");
  const [style, setStyle] = useState<ExplainStyle>("EXPLAINER");
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Library state
  const [assets, setAssets] = useState<ExplainAsset[]>([]);
  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState<ExplainZone | "ANY">("ANY");
  const [filterStatus, setFilterStatus] = useState<ExplainStatus | "ANY">(
    "ANY"
  );

  useEffect(() => {
    // hydrate assets from localStorage on client
    const initial = loadAssets();
    // newest first
    setAssets(
      [...initial].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, []);

  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (filterZone !== "ANY" && a.zone !== filterZone) return false;
      if (filterStatus !== "ANY" && a.status !== filterStatus) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.prompt.toLowerCase().includes(q)
      );
    });
  }, [assets, search, filterZone, filterStatus]);

  const handleGeneratePrompt = () => {
    const next = buildPrompt({
      zone,
      audience,
      language,
      duration,
      style,
      includeNumbers,
    });
    setPrompt(next);
  };

  const handleCopyPrompt = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback("تم النسخ");
      setTimeout(() => setCopyFeedback(null), 1500);
    } catch {
      setCopyFeedback("تعذّر النسخ");
      setTimeout(() => setCopyFeedback(null), 1500);
    }
  };

  const handleSaveCurrentAsAsset = () => {
    if (!prompt.trim()) return;
    const assetTitle =
      title.trim() ||
      (language === "AR"
        ? `شرح المنطقة ${zone} (${duration})`
        : `Explain Zone-${zone} (${duration})`);
    const asset: ExplainAsset = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      title: assetTitle,
      zone,
      audience,
      language,
      duration,
      style,
      includeNumbers,
      prompt,
      status: "DRAFT",
    };
    upsertAsset(asset);
    const next = loadAssets();
    setAssets(
      [...next].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  };

  const handleExportPackage = () => {
    if (!prompt.trim()) return;

    const scriptText = prompt;
    const onScreenCues = extractOnScreenCues(prompt);
    const shotList = extractShotList(prompt, duration);
    const captions = buildVttCaptions(scriptText);

    const pkg = {
      meta: {
        zone,
        audience,
        language,
        duration,
        style,
        includeNumbers,
        createdAt: new Date().toISOString(),
      },
      script: scriptText,
      onScreenCues,
      shotList,
      captions,
    };

    try {
      const blob = new Blob([JSON.stringify(pkg, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const id = Date.now();
      a.href = url;
      a.download = `explain_package_${id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // silent failure in export
    }
  };

  const updateAssetField = <K extends keyof ExplainAsset>(
    id: string,
    field: K,
    value: ExplainAsset[K]
  ) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleSaveAssetChanges = (asset: ExplainAsset) => {
    upsertAsset(asset);
    const next = loadAssets();
    setAssets(
      [...next].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  };

  const handleDeleteAsset = (id: string) => {
    deleteAsset(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Explain Engine (Zones)
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            أداة لبناء Prompts ومواد شرح فيديو لمحرك العوائد في المناطق A/B/C/D،
            مع الالتزام بالـ Financial Canon.
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6 inline-flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("PROMPT")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === "PROMPT"
                ? "bg-white shadow text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Prompt Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("LIBRARY")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === "LIBRARY"
                ? "bg-white shadow text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Video Library
          </button>
        </div>

        {activeTab === "PROMPT" ? (
          <section className="grid gap-6 md:grid-cols-2">
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                إعدادات Prompt
              </h2>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      المنطقة (Zone)
                    </label>
                    <select
                      value={zone}
                      onChange={(e) =>
                        setZone(e.target.value as ExplainZone)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="A">Zone-A</option>
                      <option value="B">Zone-B</option>
                      <option value="C">Zone-C</option>
                      <option value="D">Zone-D</option>
                      <option value="ALL">All Zones</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      الجمهور (Audience)
                    </label>
                    <select
                      value={audience}
                      onChange={(e) =>
                        setAudience(e.target.value as ExplainAudience)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="INVESTOR">Investor</option>
                      <option value="OPERATOR">Operator</option>
                      <option value="PUBLIC">Public</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      اللغة (Language)
                    </label>
                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(e.target.value as ExplainLanguage)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="AR">العربية</option>
                      <option value="EN">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      المدة (Duration)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) =>
                        setDuration(e.target.value as ExplainDuration)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="30s">30s</option>
                      <option value="60s">60s</option>
                      <option value="90s">90s</option>
                      <option value="3min">3 min</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      الأسلوب (Style)
                    </label>
                    <select
                      value={style}
                      onChange={(e) =>
                        setStyle(e.target.value as ExplainStyle)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="EXPLAINER">Explainer</option>
                      <option value="PITCH">Pitch</option>
                      <option value="TECHNICAL">Technical</option>
                      <option value="STORY">Story</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                      />
                      تضمين أرقام (100 ريال / 10٪ ...)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    عنوان اختياري (Prompt Title)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
                    placeholder="مثال: Zone-A Explainer for Investor"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleGeneratePrompt}
                  size="sm"
                >
                  Generate Prompt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => prompt && handleCopyPrompt(prompt)}
                  disabled={!prompt}
                >
                  Copy Prompt
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveCurrentAsAsset}
                  disabled={!prompt}
                >
                  Save to Library
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleExportPackage}
                  disabled={!prompt}
                >
                  Export Package
                </Button>
                {copyFeedback && (
                  <span className="text-xs text-emerald-600">
                    {copyFeedback}
                  </span>
                )}
              </div>
            </Card>

            <Card className="flex flex-col">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Generated Prompt
              </h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 h-80 w-full flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono leading-relaxed"
                placeholder="سيظهر الـ Prompt هنا بعد الضغط على Generate Prompt..."
              />
            </Card>
          </section>
        ) : (
          <section className="space-y-4">
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Video Library
              </h2>
              <div className="flex flex-wrap gap-3 text-sm">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="min-w-[180px] flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
                  placeholder="بحث في العنوان أو الـ Prompt..."
                />
                <select
                  value={filterZone}
                  onChange={(e) =>
                    setFilterZone(e.target.value as ExplainZone | "ANY")
                  }
                  className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                >
                  <option value="ANY">كل المناطق</option>
                  <option value="A">Zone-A</option>
                  <option value="B">Zone-B</option>
                  <option value="C">Zone-C</option>
                  <option value="D">Zone-D</option>
                  <option value="ALL">All Zones</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as ExplainStatus | "ANY")
                  }
                  className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                >
                  <option value="ANY">كل الحالات</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PRODUCED">Produced</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </Card>

            <div className="space-y-4">
              {filteredAssets.length === 0 ? (
                <Card className="text-sm text-slate-500">
                  لا توجد عناصر محفوظة بعد. استخدم تبويب Prompt Builder لحفظ
                  أول عنصر.
                </Card>
              ) : (
                filteredAssets.map((asset) => (
                  <Card key={asset.id} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {asset.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {new Date(asset.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                          Zone: {asset.zone}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                          {asset.duration}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                          {asset.language}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 ${
                            asset.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-700"
                              : asset.status === "PRODUCED"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </div>
                    </div>

                    <details className="rounded-md bg-slate-50 p-3 text-xs">
                      <summary className="cursor-pointer text-slate-700">
                        Prompt (اضغط للعرض)
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-slate-800">
                        {asset.prompt}
                      </pre>
                    </details>

                    <div className="grid gap-3 text-sm md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-600">
                          Status
                        </label>
                        <select
                          value={asset.status}
                          onChange={(e) =>
                            updateAssetField(
                              asset.id,
                              "status",
                              e.target.value as ExplainStatus
                            )
                          }
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PRODUCED">Produced</option>
                          <option value="PUBLISHED">Published</option>
                        </select>

                        <label className="block text-xs font-medium text-slate-600">
                          Video URL
                        </label>
                        <input
                          type="text"
                          value={asset.videoUrl ?? ""}
                          onChange={(e) =>
                            updateAssetField(
                              asset.id,
                              "videoUrl",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-600">
                          Notes
                        </label>
                        <textarea
                          value={asset.notes ?? ""}
                          onChange={(e) =>
                            updateAssetField(asset.id, "notes", e.target.value)
                          }
                          className="mt-1 h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs"
                          placeholder="ملاحظات عن النسخة أو التعليق الصوتي أو تعديلات مقترحة..."
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPrompt(asset.prompt)}
                      >
                        Copy Prompt
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSaveAssetChanges(asset)}
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

