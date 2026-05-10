import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/books")({ component: AdminBooks });

function AdminBooks() {
  const [books, setBooks] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await api.books.getAll();
      setBooks(data);
    } catch (error) {
      toast.error("Failed to load books");
    }
  };
  
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Books ({books.length})</h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Auth No</th>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((b) => (
              <tr key={b.authNo}>
                <td className="p-3 font-mono text-xs">{b.authNo}</td>
                <td className="p-3 font-medium">{b.title}</td>
                <td className="p-3 text-muted-foreground">{b.author}</td>
                <td className="p-3"><Badge variant="secondary">{b.category ?? "—"}</Badge></td>
                <td className="p-3">₹{Number(b.price || 0).toFixed(2)}</td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No books yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
