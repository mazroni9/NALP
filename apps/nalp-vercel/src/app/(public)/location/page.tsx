import { Card } from "@/components/ui/Card";

export default function LocationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">Location</h1>
      <p className="mt-2 text-slate-600">
        Strategic positioning on the Jubail–Dammam corridor.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Jubail–Dammam Axis</h2>
          <p className="mt-2 text-slate-600">
            NALP is strategically situated along the vital Jubail–Dammam
            corridor, providing excellent connectivity to industrial zones,
            ports, and urban centers. The site benefits from proximity to major
            highways and logistics hubs.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Connectivity</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>Jubail Industrial City</li>
            <li>Dammam / Dhahran</li>
            <li>King Fahd Industrial Port</li>
            <li>Major highway access</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
