import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Clock, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Search,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CONFIG ---
const API_URL = "https://cloudaccrual-api.ct-trading-bot1.workers.dev";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState("AWS");
  const [vendors, setVendors] = useState<any[]>([]);

  // 1. Fetch Data from Cloudflare
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Real AWS Status
        const response = await fetch(`${API_URL}/vendor/AWS`);
        const realData = await response.json();
        
        // Combine Mock Data + Real Data
        setVendors([
          { id: 1, name: "Acme Corp", invoice: "INV-2024-001", amount: 15750.00, confidence: 92, status: "Approved" },
          { id: 2, name: "CloudFirst", invoice: "INV-2024-006", amount: 18900.00, confidence: 95, status: "Approved" },
          { 
            id: 3, 
            name: "AWS", 
            invoice: "INV-2024-005", 
            amount: 14250.00, 
            confidence: 45, 
            status: realData.status || "Error", // REAL STATUS
            isReal: true 
          }, 
          { id: 4, name: "DataStream", invoice: "INV-2024-009", amount: 22500.00, confidence: 88, status: "Pending" },
        ]);
      } catch (error) {
        console.error("API Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="leading-none">Finance Agent</h1>
              <span className="text-xs font-normal text-muted-foreground">Vendor Accruals Dashboard</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-600 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Online
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        
        {/* STATS CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Accruals" value="$155,171.50" sub="8 vendors" icon={<span className="text-xl font-bold">$</span>} />
          <StatCard title="Pending Amount" value="$93,170.75" sub="4 pending" icon={<Clock className="h-4 w-4" />} />
          <StatCard title="Avg. Confidence" value="74%" sub="Medium confidence" icon={<TrendingUp className="h-4 w-4" />} />
          <StatCard title="Resolved" value="4" sub="of 8 total" icon={<Users className="h-4 w-4" />} />
        </div>

        {/* SPLIT VIEW */}
        <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
          
          {/* LEFT: TABLE */}
          <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b flex flex-row items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Vendor Accruals</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input placeholder="Search vendors..." className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
            </div>
            
            <div className="p-0 overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                  <tr>
                    <th className="h-10 px-4 align-middle">Vendor</th>
                    <th className="h-10 px-4 align-middle">Invoice #</th>
                    <th className="h-10 px-4 align-middle">Amount</th>
                    <th className="h-10 px-4 align-middle">Confidence</th>
                    <th className="h-10 px-4 align-middle">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : vendors.map((v) => (
                    <tr 
                      key={v.id} 
                      onClick={() => setSelectedVendor(v.name)}
                      className={cn(
                        "transition-colors hover:bg-muted/50 cursor-pointer",
                        selectedVendor === v.name && "bg-muted"
                      )}
                    >
                      <td className="p-4 font-medium text-foreground">{v.name}</td>
                      <td className="p-4 text-muted-foreground">{v.invoice}</td>
                      <td className="p-4 font-mono">${v.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <ConfidenceBar score={v.confidence} />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={v.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: CHAT */}
          <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Negotiation Log
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Chatting with <span className="font-medium text-foreground">{selectedVendor}</span></p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
              <ChatMessage role="ai" text={`Good morning. I am analyzing the invoice for ${selectedVendor}. The service description appears incomplete.`} />
              <ChatMessage role="vendor" text="Which sections are you concerned about?" />
              <ChatMessage role="ai" text="The line item for 'Premium Support' was waived in our Q3 agreement." />
            </div>

            <div className="p-4 border-t mt-auto">
               <div className="flex gap-2">
                 <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Type a manual override..." />
                 <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90">
                   Send
                 </button>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const isHigh = score > 80;
  return (
    <div className="flex items-center gap-2 w-full max-w-[140px]">
      <span className={cn("text-xs font-bold w-8", isHigh ? "text-green-600" : "text-amber-600")}>{score}%</span>
      <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all", isHigh ? "bg-green-500" : "bg-amber-500")} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isApproved = status === "Approved" || status === "Ready for Review";
  return (
    <div className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      isApproved 
        ? "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80"
        : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
    )}>
      {status}
    </div>
  );
}

function ChatMessage({ role, text }: { role: 'ai' | 'vendor', text: string }) {
  const isAi = role === 'ai';
  return (
    <div className={cn("flex w-full", isAi ? "justify-start" : "justify-end")}>
      <div className={cn(
        "flex max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
        isAi ? "bg-card border text-card-foreground" : "bg-primary text-primary-foreground"
      )}>
        {text}
      </div>
    </div>
  );
}
