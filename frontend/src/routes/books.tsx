import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Route = createFileRoute("/books")({
  component: Catalog,
  head: () => ({ meta: [{ title: "Catalog — CITK Library" }] }),
});

function Catalog() {
  const [books, setBooks] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.books.getAll().then((data) => setBooks(data)).catch(console.error);
  }, []);

  const filtered = books.filter((b) =>
    [b.title, b.author, b.category, b.ISBN].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl">Book Catalog</h1>
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, author, category…" className="pl-9" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <div key={b.authNo} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)]">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg">{b.title}</h3>
                <Badge variant="secondary">{b.authNo}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">by {b.author}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {b.category && <span>{b.category}</span>}
                {b.edition && <span>{b.edition}</span>}
                {b.ISBN && <span className="font-mono">{b.ISBN}</span>}
                {b.price && <span>₹{Number(b.price).toFixed(2)}</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted-foreground">No books found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
