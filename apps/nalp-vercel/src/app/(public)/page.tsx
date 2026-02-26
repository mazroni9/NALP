import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const keyNumbers = [
  { label: "Total Land Area", value: "33,000 m²" },
  { label: "Zones", value: "2" },
  { label: "Zone A (Housing)", value: "G+2 Concept" },
  { label: "Zone B (Auto)", value: "Services & Storage" },
];

export default function HomePage() {
  return (
    <div className="relative">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Nabiyah Automotive & Logistics Park
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
            A premier mixed-use development combining workforce housing with
            automotive services, auctions, and storage—strategically located on
            the Jubail–Dammam corridor.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/asset-zones">
              <Button variant="secondary" className="!bg-white !text-indigo-600 hover:!bg-indigo-50">
                Explore Zones
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="!border-white !text-white hover:!bg-white/10">
                Request NDA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          Key Numbers
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keyNumbers.map((item, i) => (
            <Card key={i}>
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-indigo-600">
                {item.value}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-100 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Investor Portal & Design Studio
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Access the Data Room, run financial scenarios, and design land
            layouts with our AI-assisted Design Studio.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/portal">
              <Button>Login to Portal</Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline">Design Studio</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
