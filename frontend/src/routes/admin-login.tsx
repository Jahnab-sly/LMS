import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookMarked, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
  head: () => ({ meta: [{ title: "Admin Login — CITK Library" }] }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    
    try {
      const username = String(fd.get("username"));
      const password = String(fd.get("password"));
      
      // First check if credentials are valid and user is an admin
      const response = await api.auth.login(username, password);
      
      if (!response.success) {
        toast.error(response.message || "Login failed");
        setBusy(false);
        return;
      }
      
      if (response.role !== "admin") {
        toast.error("Access denied. Admin credentials required.");
        setBusy(false);
        return;
      }

      // Use auth context login to properly set user state
      await login(username, password);
      toast.success("Welcome, Admin!");
      navigate({ to: "/admin" });
    } catch (error: any) {
      toast.error(error.message || "Unable to connect to server");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-navy)] px-3 py-6 sm:px-4 sm:py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3 text-primary-foreground">
          <img src="/citklogo.png" alt="CITK Library" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" />
          <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gold drop-shadow-lg">CITK Library</span>
        </Link>
        
        <Card className="rounded-xl sm:rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader className="text-center px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-serif">Admin Login</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Access the administrative dashboard</CardDescription>
          </CardHeader>
          <CardContent className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="username" className="text-xs sm:text-sm">Admin Username</Label>
                <Input 
                  id="username" 
                  name="username" 
                  type="text" 
                  placeholder="Enter admin username"
                  className="h-9 sm:h-10 text-sm"
                  required 
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter password"
                  className="h-9 sm:h-10 text-sm"
                  required 
                />
              </div>
              <Button type="submit" className="w-full h-9 sm:h-10 text-sm" disabled={busy}>
                {busy ? "Signing in…" : "Sign in as Admin"}
              </Button>
            </form>
            
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Not an admin?{" "}
                <Link to="/student-login" className="text-primary hover:underline">
                  Student Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
