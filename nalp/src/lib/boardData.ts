export type BoardMember = {
  role: string;
  count: number;
  group: string;
  annualComp: number;
};

export type ExecutiveMember = {
  role: string;
  annualComp: number;
  duties: string;
};

export type ExternalService = {
  service: string;
  annualCost: number;
};

export type VotingRule = {
  type: string;
  quorum: string;
};

export const BOARD_STRUCTURE = {
  maxAdminCostPercent: 10,
  annualIncome: 6_750_303,
  maxAdminBudget: 675_030,

  boardMembers: [
    { role: "رئيس مجلس الإدارة", count: 1, group: "منتخب", annualComp: 60_000 },
    { role: "عضو مجلس أول (مجموعة أحمد)", count: 1, group: "أبناء أحمد", annualComp: 30_000 },
    { role: "عضو مجلس ثانٍ (مجموعة أحمد)", count: 1, group: "أبناء أحمد", annualComp: 30_000 },
    { role: "عضو مجلس (مجموعة عطية)", count: 1, group: "أبناء عطية", annualComp: 30_000 },
    { role: "عضو مجلس (مجموعة عبدالرحمن)", count: 1, group: "أبناء عبدالرحمن", annualComp: 30_000 },
    { role: "عضو مستقل (خبير مالي/قانوني)", count: 1, group: "مستقل", annualComp: 30_000 },
  ],
  totalBoardCost: 210_000,

  executiveTeam: [
    {
      role: "مدير تنفيذي (CEO)",
      annualComp: 120_000,
      duties: "إدارة العقود والتنسيق مع المستثمرين وتوزيع الأرباح",
    },
    {
      role: "محاسب قانوني (مستقل)",
      annualComp: 60_000,
      duties: "مراجعة الحسابات وتدقيق OPEX وإعداد التقارير",
    },
  ],
  totalExecutiveCost: 180_000,

  externalServices: [
    { service: "مكتب قانوني", annualCost: 60_000 },
    { service: "مدقق حسابات خارجي مستقل", annualCost: 40_000 },
    { service: "منصة رقمية واستضافة NALP", annualCost: 12_000 },
    { service: "مصاريف متنوعة (اجتماعات، توثيق)", annualCost: 20_000 },
  ],
  totalExternalCost: 132_000,

  totalAdminCost: 522_000,
  adminCostPercent: 7.7,
  safetyMargin: 153_030,

  votingRules: [
    { type: "قرارات عادية", quorum: "أغلبية بسيطة 4/6" },
    { type: "قرارات مهمة", quorum: "أغلبية مؤهلة 5/6" },
    { type: "قرارات مصيرية (بيع الأرض، حل الشركة)", quorum: "إجماع + موافقة 75% من الملاك" },
    { type: "تعديل حصة شريك", quorum: "موافقة الشريك نفسه + 4/5 المجلس" },
  ],

  distributionSchedule: "ربع سنوي (كل 3 أشهر)",
};
