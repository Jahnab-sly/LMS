import { Link, useNavigate } from "@tanstack/react-router";
import { BookMarked, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur no-print">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/citklogo.png" alt="CITK Library" className="h-8 w-8 object-contain" />
          <span className="font-serif text-xl font-semibold">CITK Library</span>
        </Link>
        <nav className="flex items-center gap-2">
          {user && role === "student" && (
            <Link to="/dashboard" className="px-3 py-2 text-sm font-medium hover:text-gold">My Dashboard</Link>
          )}
          {user && role === "admin" && (
            <Link to="/admin" className="px-3 py-2 text-sm font-medium hover:text-gold">Admin</Link>
          )}
          {user ? (
            <>
              <span className="ml-2 hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                <User className="h-4 w-4" />{user.username}
              </span>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="ml-2"><Link to="/student-login">Sign in</Link></Button>
          )}
        </nav>
      </div>
    </header>
  );
}
