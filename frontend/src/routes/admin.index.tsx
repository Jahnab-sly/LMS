import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Users, Receipt, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ books: 0, students: 0, active: 0, fines: 0 });
  const [issueBookOpen, setIssueBookOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const loadStats = async () => {
    try {
      const [booksData, studentsData, transactions] = await Promise.all([
        api.books.getAll(),
        api.students.getAll(),
        api.transactions.getAll(),
      ]);
      
      setBooks(booksData);
      setStudents(studentsData);
      
      setStats({
        books: booksData.length,
        students: studentsData.length,
        active: transactions.filter((t: any) => t.status === "Issued").length,
        fines: transactions.reduce((sum: number, t: any) => sum + Number(t.fine || 0), 0),
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const issueBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const bookData = {
      userId: String(fd.get("userId")),
      studentName: String(fd.get("studentName")),
      authNo: String(fd.get("authNo")),
      issue_date: String(fd.get("issue_date")),
      due_date: String(fd.get("due_date")),
    };

    console.log("Sending book issue request:", bookData);
    
    try {
      const result = await api.transactions.issueBook(bookData);
      console.log("Issue book result:", result);
      
      toast.success("Book issued successfully");
      setIssueBookOpen(false);
      loadStats();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Issue book error:", error);
      toast.error(error.message || "Failed to issue book");
    }
  };

  const addBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    try {
      await api.books.add({
        authNo: String(fd.get("authNo")),
        title: String(fd.get("title")),
        author: String(fd.get("author")),
        ISBN: String(fd.get("ISBN")),
        edition: String(fd.get("edition")),
        category: String(fd.get("category")),
        price: fd.get("price") ? Number(fd.get("price")) : undefined,
      });
      
      toast.success("Book added successfully");
      setAddBookOpen(false);
      loadStats();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add book");
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const defaultDue = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);

  const cards = [
    { icon: BookOpen, label: "Total Books", value: stats.books },
    { icon: Users, label: "Total Students", value: stats.students },
    { icon: Receipt, label: "Books Issued", value: stats.active },
    { icon: AlertCircle, label: "Total Fines", value: `₹${stats.fines.toFixed(2)}` },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground">Quick stats and actions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline">
                <Plus className="mr-2 h-5 w-5" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Add a new book to the library catalog</DialogDescription>
              </DialogHeader>
              <form onSubmit={addBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authNo">Auth No</Label>
                    <Input id="authNo" name="authNo" placeholder="e.g., BK011" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Book Title" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" placeholder="Author Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ISBN">ISBN</Label>
                    <Input id="ISBN" name="ISBN" placeholder="ISBN Number" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="e.g., Programming" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edition">Edition</Label>
                    <Input id="edition" name="edition" placeholder="e.g., 1st" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddBookOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Book</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={issueBookOpen} onOpenChange={setIssueBookOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Issue Book
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Issue Book to Student</DialogTitle>
              <DialogDescription>Issue a book from the library to a student</DialogDescription>
            </DialogHeader>
            <form onSubmit={issueBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Student ID</Label>
                  <Input id="userId" name="userId" placeholder="e.g., U001" required />
                  <p className="text-xs text-muted-foreground">
                    Available: {students.slice(0, 3).map(s => s.user_id).join(", ")}
                    {students.length > 3 && ` +${students.length - 3} more`}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input id="studentName" name="studentName" placeholder="John Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="authNo">Book Auth No</Label>
                <Input id="authNo" name="authNo" placeholder="e.g., BK001" required />
                <p className="text-xs text-muted-foreground">
                  Available: {books.slice(0, 5).map(b => b.authNo).join(", ")}
                  {books.length > 5 && ` +${books.length - 5} more`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input id="issue_date" name="issue_date" type="date" defaultValue={today} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input id="due_date" name="due_date" type="date" defaultValue={defaultDue} min={today} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIssueBookOpen(false)}>Cancel</Button>
                <Button type="submit">Issue Book</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <c.icon className="h-6 w-6 text-gold" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-serif text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
