import { Card } from "@/components/ui/Card";

export default function FinancialsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">Financial Overview</h1>
      <p className="mt-2 text-slate-600">
        Simplified financial metrics and assumptions.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Key Assumptions</h2>
          <ul className="mt-4 space-y-2 text-slate-600">
            <li>• Occupancy rates</li>
            <li>• Bed rate (SAR)</li>
            <li>• OPEX cap</li>
            <li>• Land exit price assumptions</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Assumptions Table</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2">Parameter</th>
                  <th className="py-2">Base Case</th>
                  <th className="py-2">Conservative</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-2">Occupancy</td>
                  <td>85%</td>
                  <td>70%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Bed Rate (SAR)</td>
                  <td>1,200</td>
                  <td>1,000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">OPEX Cap</td>
                  <td>25%</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td className="py-2">Exit Multiple</td>
                  <td>1.2x</td>
                  <td>1.0x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-sm text-slate-500">
          For detailed financial models and scenario comparisons, log in to the
          Investor Portal.
        </p>
      </div>
    </div>
  );
}
