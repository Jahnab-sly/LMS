import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Shield, GraduationCap, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CITK Library System" },
      { name: "description", content: "A modern library management system for students and administrators." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-[var(--gradient-navy)]">
      <main>
        <section className="container mx-auto px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <div className="inline-flex items-center gap-4 rounded-full border-2 border-gold bg-gold/20 px-8 py-4 text-2xl font-bold uppercase tracking-wide text-white shadow-lg">
              <img src="/citklogo.png" alt="CITK Library" className="h-12 w-12 object-contain" />
              CITK Library System
            </div>
            <h1 className="mt-8 font-serif text-5xl font-semibold leading-tight text-white drop-shadow-lg md:text-6xl">
              <span className="text-white">Welcome to the</span> <span className="text-gold">Library</span>
            </h1>
            <p className="mt-6 text-xl font-medium text-gold">
              Your gateway to knowledge, learning, and academic excellence
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Admin Login Card */}
            <Card className="rounded-2xl border-2 border-primary/20 bg-card shadow-2xl transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
                <CardDescription>
                  Manage books, students, and library operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" className="w-full">
                  <Link to="/admin-login">Admin Login</Link>
                </Button>
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  For library administrators only
                </div>
              </CardContent>
            </Card>

            {/* Student Login Card */}
            <Card className="rounded-2xl border-2 border-primary/20 bg-card shadow-2xl transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-serif">Student Portal</CardTitle>
                <CardDescription>
                  View your borrowed books and library account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" className="w-full">
                  <Link to="/student-login">Student Login</Link>
                </Button>
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  New student? Register from the login page
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-24">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "Book Management", body: "Browse and manage the library catalog with ease." },
              { icon: Shield, title: "Secure Access", body: "Role-based access control for admins and students." },
              { icon: GraduationCap, title: "Student Dashboard", body: "Track borrowed books and due dates in one place." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-lg">
                <Icon className="h-8 w-8 text-gold" />
                <h3 className="mt-4 font-serif text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © 2026 CITK Library System
      </footer>
    </div>
  );
}
