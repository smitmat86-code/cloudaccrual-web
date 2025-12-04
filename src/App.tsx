import { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// YOUR ACTUAL BACKEND URL
const API_URL = "https://cloudaccrual-api.ct-trading-bot1.workers.dev";

export default function App() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function fetches real data from your Cloudflare Worker
    const fetchData = async () => {
      try {
        // Fetch the "AWS" vendor status from your API
        const response = await fetch(`${API_URL}/vendor/AWS`);
        const data = await response.json();
        
        // Format the data for the table
        setVendors([
          { 
            name: "AWS", 
            amount: 14250.00, 
            status: data.status, // REAL STATUS from the Durable Object
            confidence: 98,
            source: data.source 
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-900 rounded"></div>
          CloudAccrual
        </h1>
        <nav className="space-y-2">
          <button className="flex items-center gap-3 w-full px-3 py-2 bg-slate-100 rounded text-sm font-medium text-slate-900">
            <LayoutDashboard size={18}/> Dashboard
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold">Financial Period: Oct 2025</h2>
          <div className="flex items-center gap-2 text-slate-500 mt-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <p className="text-sm">Live Connection to Cloudflare Workers</p>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-700">Vendor</th>
                <th className="px-6 py-3 font-medium text-slate-700">Real Status (from DO)</th>
                <th className="px-6 py-3 font-medium text-slate-700">Source</th>
                <th className="px-6 py-3 font-medium text-slate-700">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400"/></td></tr>
              ) : vendors.map((v) => (
                <tr key={v.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium">{v.name}</td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {v.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {v.source}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-600 font-bold">{v.confidence}%</span>
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
