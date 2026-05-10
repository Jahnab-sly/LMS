import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/fines")({ component: AdminFines });

const FINE_PER_DAY = 1.0;

function AdminFines() {
  const [txs, setTxs] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await api.transactions.getAll();
      setTxs(data);
    } catch (error) {
      toast.error("Failed to load transactions");
    }
  };
  
  useEffect(() => { load(); }, []);

  // Calculate fines for overdue books
  const calculateFine = (tx: any) => {
    if (tx.status !== "Issued") return tx.fine || 0;
    
    const today = new Date();
    const dueDate = new Date(tx.due_date);
    
    if (today > dueDate) {
      const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysLate * FINE_PER_DAY;
    }
    
    return 0;
  };

  const transactionsWithFines = txs.map(tx => ({
    ...tx,
    calculatedFine: calculateFine(tx)
  })).filter(tx => tx.calculatedFine > 0 || (tx.fine && tx.fine > 0));

  const totalFines = transactionsWithFines.reduce((sum, tx) => sum + (tx.calculatedFine || tx.fine || 0), 0);
  const unpaidFines = transactionsWithFines.filter(tx => tx.status === "Issued").reduce((sum, tx) => sum + tx.calculatedFine, 0);

  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <DollarSign className="h-6 w-6 text-gold" />
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Total Fines</p>
          <p className="mt-1 text-3xl font-bold">₹{totalFines.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <DollarSign className="h-6 w-6 text-destructive" />
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Unpaid Fines</p>
          <p className="mt-1 text-3xl font-bold">₹{unpaidFines.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Paid Fines</p>
          <p className="mt-1 text-3xl font-bold">₹{(totalFines - unpaidFines).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Fines & Overdue ({transactionsWithFines.length})</h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Book</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Days Late</th>
              <th className="p-3">Fine Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactionsWithFines.map((t) => {
              const dueDate = new Date(t.due_date);
              const today = new Date();
              const daysLate = t.status === "Issued" && today > dueDate 
                ? Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                : 0;
              const fineAmount = t.calculatedFine || t.fine || 0;

              return (
                <tr key={t.transaction_id} className={daysLate > 0 ? "bg-destructive/5" : ""}>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3">{t.title}</td>
                  <td className="p-3 text-muted-foreground">{dueDate.toLocaleDateString()}</td>
                  <td className="p-3">
                    {daysLate > 0 ? (
                      <span className="font-semibold text-destructive">{daysLate} days</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={fineAmount > 0 ? "font-semibold text-destructive" : ""}>
                      ₹{fineAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant={t.status === "Returned" ? "secondary" : "destructive"}>
                      {t.status === "Issued" ? "Overdue" : t.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {transactionsWithFines.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No fines or overdue books.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Fine rate: ₹{FINE_PER_DAY.toFixed(2)} per day overdue</p>
      </div>
    </div>
  );
}
