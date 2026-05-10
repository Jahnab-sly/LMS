import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { Header } from "@/components/Header";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Student Dashboard — CITK Library" }] }),
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/student-login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const transactions = await api.transactions.getByUserId(user.userId!);
        setTxs(transactions);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    })();
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen"><Header /><div className="p-12 text-center text-muted-foreground">Loading…</div></div>;
  }

  const totalFine = txs.reduce((a, t) => a + Number(t.fine ?? 0), 0);
  const active = txs.filter((t) => t.status === "Issued");

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl text-primary">Welcome, {user.name?.split(" ")[0] || user.username}</h1>
        <p className="mt-1 text-muted-foreground">Your books and account.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[auto,1fr]">
          <div>
            <IdCard
              fullName={user.name || user.username}
              email=""
              idNumber={user.userId || "—"}
              enrollment=""
              expiry=""
              phone=""
              photoUrl=""
            />
            <Button variant="outline" className="no-print mt-4 w-full" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print card
            </Button>
          </div>

          <div className="space-y-4 no-print">
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Books Issued" value={active.length} />
              <Stat label="Total Borrowed" value={txs.length} />
              <Stat label="Fines" value={`₹${totalFine.toFixed(2)}`} />
            </div>
            <Card>
              <CardHeader><CardTitle className="font-serif text-primary">My Books</CardTitle></CardHeader>
              <CardContent>
                {txs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No books yet.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {txs.map((t) => (
                      <div key={t.transaction_id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground">{t.author} · Due {new Date(t.due_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={t.status === "Returned" ? "secondary" : "default"}>{t.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-primary/70">{label}</p>
      <p className="mt-1 font-serif text-2xl text-primary">{value}</p>
    </div>
  );
}
