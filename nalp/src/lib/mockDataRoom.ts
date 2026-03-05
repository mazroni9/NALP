/**
 * Mock Data Room categories and files.
 * TODO: Replace with real API when backend is connected (Laravel Data Room).
 */

export interface DataRoomFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  href?: string;
}

export interface DataRoomCategory {
  id: string;
  title: string;
  files: DataRoomFile[];
}

export const mockDataRoomCategories: DataRoomCategory[] = [
  {
    id: "legal",
    title: "Legal & Compliance",
    files: [
      { id: "l1", name: "NDA Template.pdf", type: "PDF", size: "120 KB", updated: "2024-01-15" },
      {
        id: "l2",
        name: "صك المزرعة (أرض المشروع).pdf",
        type: "PDF",
        size: "2.1 MB",
        updated: "2026-03-02",
        href: "/صك المزرعه.pdf",
      },
    ],
  },
  {
    id: "financial",
    title: "Financial Models",
    files: [
      { id: "f1", name: "Base Case Model.xlsx", type: "Excel", size: "850 KB", updated: "2024-01-20" },
      { id: "f2", name: "Sensitivity Analysis.xlsx", type: "Excel", size: "420 KB", updated: "2024-01-22" },
    ],
  },
  {
    id: "technical",
    title: "Technical & Design",
    files: [
      { id: "t1", name: "Masterplan Concept.pdf", type: "PDF", size: "5.2 MB", updated: "2024-02-10" },
      { id: "t2", name: "Zone A Schematic.pdf", type: "PDF", size: "3.8 MB", updated: "2024-02-12" },
    ],
  },
];
