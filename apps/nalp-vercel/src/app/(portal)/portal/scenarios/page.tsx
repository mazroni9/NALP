"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export interface Scenario {
  id: string;
  occupancy: number;
  bedRate: number;
  opexCap: number;
  exitPrice: number;
}

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [occupancy, setOccupancy] = useState(85);
  const [bedRate, setBedRate] = useState(1200);
  const [opexCap, setOpexCap] = useState(25);
  const [exitPrice, setExitPrice] = useState(1.2);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  const addScenario = () => {
    const id = `s-${Date.now()}`;
    setScenarios((prev) => [
      ...prev,
      { id, occupancy, bedRate, opexCap, exitPrice },
    ]);
  };

  const diff = (a: number, b: number) => ((a - b) / (b || 1)) * 100;

  const scA = scenarios.find((s) => s.id === compareA);
  const scB = scenarios.find((s) => s.id === compareB);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Scenarios</h1>
      <p className="mt-1 text-slate-600">
        Create and compare financial scenarios. (TODO: Backend persistence later)
      </p>

      <Card className="mt-8">
        <h2 className="font-semibold">New Scenario</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm">Occupancy (%)</label>
            <input
              type="number"
              value={occupancy}
              onChange={(e) => setOccupancy(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="block text-sm">Bed Rate (SAR)</label>
            <input
              type="number"
              value={bedRate}
              onChange={(e) => setBedRate(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">OPEX Cap (%)</label>
            <input
              type="number"
              value={opexCap}
              onChange={(e) => setOpexCap(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">Exit Price (x)</label>
            <input
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(Number(e.target.value))}
              step={0.1}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
        </div>
        <Button onClick={addScenario} className="mt-4">
          Add Scenario
        </Button>
      </Card>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Scenario List</h2>
          <ul className="mt-4 space-y-2">
            {scenarios.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded border border-slate-100 px-3 py-2"
              >
                <span className="text-sm">
                  Occ {s.occupancy}% • SAR {s.bedRate} • OPEX {s.opexCap}% • Exit {s.exitPrice}x
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCompareA(compareA === s.id ? null : s.id)}
                    className={`rounded px-2 py-1 text-xs ${compareA === s.id ? "bg-indigo-200" : "bg-slate-100 hover:bg-slate-200"}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setCompareB(compareB === s.id ? null : s.id)}
                    className={`rounded px-2 py-1 text-xs ${compareB === s.id ? "bg-indigo-200" : "bg-slate-100 hover:bg-slate-200"}`}
                  >
                    B
                  </button>
                </div>
              </li>
            ))}
            {scenarios.length === 0 && (
              <li className="text-sm text-slate-500">No scenarios yet</li>
            )}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold">Compare</h2>
          {scA && scB ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 text-left">Param</th>
                    <th className="py-2 text-left">A</th>
                    <th className="py-2 text-left">B</th>
                    <th className="py-2 text-left">Diff %</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-2">Occupancy</td>
                    <td>{scA.occupancy}%</td>
                    <td>{scB.occupancy}%</td>
                    <td>{diff(scA.occupancy, scB.occupancy).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">Bed Rate</td>
                    <td>{scA.bedRate}</td>
                    <td>{scB.bedRate}</td>
                    <td>{diff(scA.bedRate, scB.bedRate).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">OPEX Cap</td>
                    <td>{scA.opexCap}%</td>
                    <td>{scB.opexCap}%</td>
                    <td>{diff(scA.opexCap, scB.opexCap).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Exit Price</td>
                    <td>{scA.exitPrice}x</td>
                    <td>{scB.exitPrice}x</td>
                    <td>{diff(scA.exitPrice, scB.exitPrice).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Select two scenarios (A and B) to compare.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
