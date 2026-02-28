import { Card } from "@/components/ui/Card";
import {
  BOARD_STRUCTURE,
  type BoardMember,
  type ExecutiveMember,
  type ExternalService,
  type VotingRule,
} from "@/lib/boardData";
import { PARTNERS, calcPartnerData } from "@/lib/partnersData";

const COMPANY_NAME =
  "شركة النابية للسيارات والخدمات اللوجستية المساهمة المقفلة";

const GROUP_ORDER = ["أبناء أحمد عتيق", "أبناء عطية", "أبناء عبدالرحمن"] as const;

function sortPartnersByGroup() {
  return [...PARTNERS].sort(
    (a, b) =>
      GROUP_ORDER.indexOf(a.group as (typeof GROUP_ORDER)[number]) -
      GROUP_ORDER.indexOf(b.group as (typeof GROUP_ORDER)[number])
  );
}

export default function BoardPage() {
  const sortedPartners = sortPartnersByGroup();
  const partnerRows = sortedPartners.map((p) => {
    const d = calcPartnerData(p);
    return {
      name: p.name,
      group: p.group,
      sharePercent: p.sharePercent,
      shares: d.shares,
      annualIncome: d.annualIncome,
      total8Y: d.totalIncome8Y,
    };
  });

  const totals = partnerRows.reduce(
    (acc, r) => ({
      sharePercent: acc.sharePercent + r.sharePercent,
      shares: acc.shares + r.shares,
      annualIncome: acc.annualIncome + r.annualIncome,
      total8Y: acc.total8Y + r.total8Y,
    }),
    { sharePercent: 0, shares: 0, annualIncome: 0, total8Y: 0 }
  );

  const top5Partners = [...partnerRows]
    .sort((a, b) => b.sharePercent - a.sharePercent)
    .slice(0, 5);

  const progressPercent =
    (BOARD_STRUCTURE.totalAdminCost / BOARD_STRUCTURE.maxAdminBudget) * 100;

  return (
    <div className="p-8" dir="rtl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">لوحة مجلس الإدارة</h1>
        <p className="mt-1 text-slate-600">
          هيكل الشركة، حصص الشركاء، آلية التصويت وتوزيع الأرباح
        </p>
      </header>

      <div className="space-y-8">
        {/* القسم 1 — ملخص الشركة */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">ملخص الشركة</h2>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">اسم الشركة</dt>
              <dd className="font-medium">{COMPANY_NAME}</dd>
            </div>
            <div>
              <dt className="text-slate-500">عدد المساهمين</dt>
              <dd className="font-medium">41 شريكاً</dd>
            </div>
            <div>
              <dt className="text-slate-500">إجمالي الدخل السنوي</dt>
              <dd className="font-bold text-indigo-600">
                {BOARD_STRUCTURE.annualIncome.toLocaleString("en-US")} ريال
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">الحد الأقصى للمصاريف الإدارية (10%)</dt>
              <dd className="font-medium">
                {BOARD_STRUCTURE.maxAdminBudget.toLocaleString("en-US")} ريال/سنة
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">التكلفة الإدارية الفعلية</dt>
              <dd className="font-bold">
                {BOARD_STRUCTURE.totalAdminCost.toLocaleString("en-US")} ريال (
                {BOARD_STRUCTURE.adminCostPercent}%)
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">هامش الأمان</dt>
              <dd className="font-bold text-green-600">
                {BOARD_STRUCTURE.safetyMargin.toLocaleString("en-US")} ريال
              </dd>
            </div>
          </dl>
        </Card>

        {/* القسم 2 — جدول حصص جميع الشركاء */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">
            جدول حصص جميع الشركاء (لوحة مجلس الإدارة)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 font-medium text-slate-600">الاسم</th>
                  <th className="px-2 py-2 font-medium text-slate-600">المجموعة</th>
                  <th className="px-2 py-2 font-medium text-slate-600">الحصة%</th>
                  <th className="px-2 py-2 font-medium text-slate-600">الأسهم</th>
                  <th className="px-2 py-2 font-medium text-slate-600">الدخل السنوي</th>
                  <th className="px-2 py-2 font-medium text-slate-600">إجمالي 8 سنوات</th>
                </tr>
              </thead>
              <tbody>
                {partnerRows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-2">{r.name}</td>
                    <td className="px-2 py-2 text-slate-600">{r.group}</td>
                    <td className="px-2 py-2">{r.sharePercent}</td>
                    <td className="px-2 py-2">{r.shares.toLocaleString("en-US")}</td>
                    <td className="px-2 py-2">
                      {r.annualIncome.toLocaleString("en-US")}
                    </td>
                    <td className="px-2 py-2">
                      {r.total8Y.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-300 font-semibold">
                  <td className="px-2 py-2">الإجمالي</td>
                  <td className="px-2 py-2">—</td>
                  <td className="px-2 py-2">{totals.sharePercent.toFixed(2)}%</td>
                  <td className="px-2 py-2">{totals.shares.toLocaleString("en-US")}</td>
                  <td className="px-2 py-2">
                    {totals.annualIncome.toLocaleString("en-US")}
                  </td>
                  <td className="px-2 py-2">{totals.total8Y.toLocaleString("en-US")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* القسم 3 — هيكل مجلس الإدارة */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">
            هيكل مجلس الإدارة
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 font-medium text-slate-600">المنصب</th>
                  <th className="px-2 py-2 font-medium text-slate-600">المجموعة</th>
                  <th className="px-2 py-2 font-medium text-slate-600">
                    التعويض السنوي
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOARD_STRUCTURE.boardMembers.map((m: BoardMember, i: number) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-2">{m.role}</td>
                    <td className="px-2 py-2 text-slate-600">{m.group}</td>
                    <td className="px-2 py-2">
                      {m.annualComp.toLocaleString("en-US")} ريال
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            يُنتخب الرئيس بتصويت الشركاء كل سنتين
          </p>
        </Card>

        {/* القسم 4 — الجهاز التنفيذي والخدمات الخارجية */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">
            الجهاز التنفيذي والخدمات الخارجية
          </h2>

          <h3 className="mt-4 text-sm font-medium text-slate-700">الجهاز التنفيذي</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 font-medium text-slate-600">المنصب</th>
                  <th className="px-2 py-2 font-medium text-slate-600">المهام</th>
                  <th className="px-2 py-2 font-medium text-slate-600">
                    التعويض السنوي
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOARD_STRUCTURE.executiveTeam.map(
                  (e: ExecutiveMember, i: number) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-2 py-2">{e.role}</td>
                      <td className="px-2 py-2 text-slate-600">{e.duties}</td>
                      <td className="px-2 py-2">
                        {e.annualComp.toLocaleString("en-US")} ريال
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            الإجمالي:{" "}
            {BOARD_STRUCTURE.totalExecutiveCost.toLocaleString("en-US")} ريال
          </p>

          <h3 className="mt-6 text-sm font-medium text-slate-700">
            الخدمات الخارجية
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 font-medium text-slate-600">الخدمة</th>
                  <th className="px-2 py-2 font-medium text-slate-600">
                    التكلفة السنوية
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOARD_STRUCTURE.externalServices.map(
                  (s: ExternalService, i: number) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-2 py-2">{s.service}</td>
                      <td className="px-2 py-2">
                        {s.annualCost.toLocaleString("en-US")} ريال
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            الإجمالي:{" "}
            {BOARD_STRUCTURE.totalExternalCost.toLocaleString("en-US")} ريال
          </p>

          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                {BOARD_STRUCTURE.totalAdminCost.toLocaleString("en-US")} من أصل{" "}
                {BOARD_STRUCTURE.maxAdminBudget.toLocaleString("en-US")} ريال (
                {Math.round(progressPercent)}%)
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* القسم 5 — آلية التصويت */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">آلية التصويت</h2>
          <div className="mt-4 space-y-3">
            {BOARD_STRUCTURE.votingRules.map((v: VotingRule, i: number) => {
              const bg =
                i === 0
                  ? "bg-slate-50 border-slate-200"
                  : i === 1
                    ? "bg-amber-50 border-amber-200"
                    : i === 2
                      ? "bg-red-50 border-red-200"
                      : "bg-indigo-50 border-indigo-200";
              return (
                <div
                  key={i}
                  className={`rounded-lg border px-4 py-3 ${bg}`}
                >
                  <span className="font-medium text-slate-800">{v.type}</span>
                  <span className="mx-2 text-slate-500">—</span>
                  <span className="text-slate-600">{v.quorum}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* القسم 6 — آلية توزيع الأرباح */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">
            آلية توزيع الأرباح
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded bg-slate-100 px-3 py-1 font-medium">
              الدخل الإجمالي
            </span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-amber-100 px-3 py-1">خصم OPEX</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-indigo-100 px-3 py-1">
              خصم إداري {BOARD_STRUCTURE.adminCostPercent}%
            </span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-green-100 px-3 py-1 font-medium">
              صافي موزَّع
            </span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-indigo-200 px-3 py-1">
              كل شريك يستلم حصته% كل 3 أشهر
            </span>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            جدول توزيع ربعي تقديري لأعلى 5 شركاء حصصاً
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 font-medium text-slate-600">الاسم</th>
                  <th className="px-2 py-2 font-medium text-slate-600">الحصة%</th>
                  <th className="px-2 py-2 font-medium text-slate-600">
                    التوزيع الربعي (تقديري)
                  </th>
                </tr>
              </thead>
              <tbody>
                {top5Partners.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-2">{p.name}</td>
                    <td className="px-2 py-2">{p.sharePercent}%</td>
                    <td className="px-2 py-2 font-medium">
                      {Math.round(p.annualIncome / 4).toLocaleString("en-US")}{" "}
                      ريال
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {BOARD_STRUCTURE.distributionSchedule}
          </p>
        </Card>
      </div>
    </div>
  );
}
