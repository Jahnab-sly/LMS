import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — CITK Library" }] }),
});

function AdminLayout() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/admin-login" });
    else if (role && role !== "admin") navigate({ to: "/dashboard" });
  }, [user, role, loading, navigate]);

  if (loading || !user || role !== "admin") {
    return <div className="min-h-screen"><Header /><div className="p-12 text-center text-muted-foreground">Checking access…</div></div>;
  }

  const tabs = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/students", label: "Students" },
    { to: "/admin/books", label: "Books" },
    { to: "/admin/fines", label: "Fines" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl">Admin Console</h1>
        <nav className="mt-6 flex gap-1 border-b border-border">
          {tabs.map((t) => {
            const active = location.pathname === t.to || (t.to !== "/admin" && location.pathname.startsWith(t.to));
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                  active ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div className="py-8"><Outlet /></div>
      </main>
    </div>
  );
}
