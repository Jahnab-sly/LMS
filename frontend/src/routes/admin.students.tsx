import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/students")({ component: AdminStudents });

function AdminStudents() {
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await api.students.getAll();
      setList(data);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };
  
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="font-serif text-xl">Students ({list.length})</h2>
      <p className="text-sm text-muted-foreground">Students can register from the login page.</p>
      
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">User ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((s) => (
              <tr key={s.user_id}>
                <td className="p-3 font-mono text-xs text-gold">{s.user_id}</td>
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3 text-muted-foreground">{s.email || "—"}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">No students yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
