import { useState } from 'react';
import { LayoutDashboard, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [vendors] = useState([
    { name: "AWS", amount: 14250.00, status: "Ready", confidence: 98 },
    { name: "Twilio", amount: 2100.50, status: "Pending", confidence: 45 },
    { name: "Datadog", amount: 8500.00, status: "Ready", confidence: 92 },
  ]);

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8 text-slate-900">CloudAccrual</h1>
        <nav className="space-y-2">
          <button className="flex items-center gap-3 w-full px-3 py-2 bg-slate-100 text-slate-900 rounded text-sm font-medium">
            <LayoutDashboard size={18}/> Dashboard
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Financial Period: Oct 2025</h2>
          <p className="text-slate-500">Overview of current AI estimates</p>
        </header>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-700">Vendor</th>
                <th className="px-6 py-3 font-medium text-slate-700">Estimate</th>
                <th className="px-6 py-3 font-medium text-slate-700">Confidence</th>
                <th className="px-6 py-3 font-medium text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.name} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{v.name}</td>
                  <td className="px-6 py-4 text-slate-600">${v.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${v.confidence > 90 ? "text-emerald-600" : "text-amber-600"}`}>
                      {v.confidence}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {v.confidence > 90 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12}/> Auto-Drafted
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 shadow-sm">
                        <AlertCircle size={12}/> Review Needed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
