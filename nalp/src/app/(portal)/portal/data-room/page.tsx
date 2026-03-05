import { Card } from "@/components/ui/Card";
import { mockDataRoomCategories } from "@/lib/mockDataRoom";

const categoryTitles: Record<string, string> = {
  legal: "القانونية والامتثال",
  financial: "النماذج المالية",
  technical: "الفنية والتصميم",
};

export default function DataRoomPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">غرفة البيانات</h1>
      <p className="mt-1 text-slate-600">
        تصفح المستندات حسب الفئة. (سيتم الربط بخزانة حقيقية لاحقاً)
      </p>
      <div className="mt-8 space-y-6">
        {mockDataRoomCategories.map((cat) => (
          <Card key={cat.id}>
            <h2 className="text-lg font-semibold">
              {categoryTitles[cat.id] ?? cat.title}
            </h2>
            <ul className="mt-4 space-y-2">
              {cat.files.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2"
                >
                  <span className="font-medium">
                    {f.href ? (
                      <a
                        href={f.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {f.name}
                      </a>
                    ) : (
                      f.name
                    )}
                  </span>
                  <span className="text-sm text-slate-500">
                    {f.type} • {f.size} • {f.updated}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
