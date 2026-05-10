import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookMarked, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/student-login")({
  component: StudentLoginPage,
  head: () => ({ meta: [{ title: "Student Login — CITK Library" }] }),
});

function StudentLoginPage() {
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
      
      // First check if credentials are valid and user is a student
      const response = await api.auth.login(username, password);
      
      if (!response.success) {
        toast.error(response.message || "Login failed");
        setBusy(false);
        return;
      }
      
      if (response.role !== "student") {
        toast.error("Access denied. Student credentials required.");
        setBusy(false);
        return;
      }

      // Use auth context login to properly set user state
      await login(username, password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Unable to connect to server");
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    
    const password = String(fd.get("password"));
    const confirmPassword = String(fd.get("confirm_password"));
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setBusy(false);
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setBusy(false);
      return;
    }
    
    try {
      const response = await api.students.register({
        user_id: String(fd.get("user_id")),
        firstname: String(fd.get("firstname")),
        lastname: String(fd.get("lastname")),
        email: String(fd.get("email")),
        phone_no: String(fd.get("phone_no")),
        address: String(fd.get("address")),
        password: password,
      });
      
      if (response.success) {
        toast.success("Registration successful! You can now sign in.");
        navigate({ to: "/student-login" });
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Unable to connect to server");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-navy)] px-3 py-6 sm:px-4 sm:py-8">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3 text-primary-foreground">
          <img src="/citklogo.png" alt="CITK Library" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" />
          <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gold drop-shadow-lg">CITK Library</span>
        </Link>
        
        <Card className="rounded-xl sm:rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader className="text-center px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-serif">Student Portal</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Sign in or register as a student</CardDescription>
          </CardHeader>
          <CardContent className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
                <TabsTrigger value="signin" className="text-xs sm:text-sm">Sign in</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs sm:text-sm">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4 sm:mt-6">
                <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="si-username" className="text-xs sm:text-sm">Student ID / Username</Label>
                    <Input 
                      id="si-username" 
                      name="username" 
                      type="text" 
                      placeholder="Enter your student ID"
                      className="h-9 sm:h-10 text-sm"
                      required 
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="si-password" className="text-xs sm:text-sm">Password</Label>
                    <Input 
                      id="si-password" 
                      name="password" 
                      type="password" 
                      placeholder="Enter password"
                      className="h-9 sm:h-10 text-sm"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full h-9 sm:h-10 text-sm" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4 sm:mt-6">
                <form onSubmit={handleRegister} className="space-y-2.5 sm:space-y-3">
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="su-userid" className="text-xs sm:text-sm">Student ID</Label>
                    <Input 
                      id="su-userid" 
                      name="user_id" 
                      placeholder="e.g., U001, STU123"
                      className="h-8 sm:h-9 text-sm"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="space-y-1 sm:space-y-1.5">
                      <Label htmlFor="su-firstname" className="text-xs sm:text-sm">First Name</Label>
                      <Input id="su-firstname" name="firstname" className="h-8 sm:h-9 text-sm" required />
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <Label htmlFor="su-lastname" className="text-xs sm:text-sm">Last Name</Label>
                      <Input id="su-lastname" name="lastname" className="h-8 sm:h-9 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="su-email" className="text-xs sm:text-sm">Email</Label>
                    <Input id="su-email" name="email" type="email" className="h-8 sm:h-9 text-sm" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="su-phone" className="text-xs sm:text-sm">Phone Number</Label>
                    <Input id="su-phone" name="phone_no" type="tel" className="h-8 sm:h-9 text-sm" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="su-address" className="text-xs sm:text-sm">Address</Label>
                    <Input id="su-address" name="address" className="h-8 sm:h-9 text-sm" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="su-password" className="text-xs sm:text-sm">Password</Label>
                    <Input id="su-password" name="password" type="password" placeholder="At least 6 characters" className="h-8 sm:h-9 text-sm" required />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="su-confirm-password" className="text-xs sm:text-sm">Confirm Password</Label>
                    <Input id="su-confirm-password" name="confirm_password" type="password" placeholder="Re-enter password" className="h-8 sm:h-9 text-sm" required />
                  </div>
                  <Button type="submit" className="w-full h-9 sm:h-10 text-sm mt-3 sm:mt-4" disabled={busy}>
                    {busy ? "Registering…" : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Are you an admin?{" "}
                <Link to="/admin-login" className="text-primary hover:underline">
                  Admin Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
