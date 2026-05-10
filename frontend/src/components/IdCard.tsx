import { BookMarked } from "lucide-react";

interface Props {
  fullName: string;
  email: string;
  idNumber: string;
  enrollment: string | null;
  expiry: string | null;
  phone?: string | null;
  photoUrl?: string | null;
}

export function IdCard({ fullName, email, idNumber, enrollment, expiry, phone, photoUrl }: Props) {
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—");
  return (
    <div className="printable">
      <div
        className="relative w-[420px] overflow-hidden rounded-2xl text-primary-foreground shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-gold" />
            <span className="font-serif text-lg">CITK Library</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gold">Student</span>
        </div>
        <div className="flex gap-5 p-6">
          <div className="flex h-24 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white/5">
            {photoUrl ? (
              <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <span className="font-serif text-3xl text-gold">
                {fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-white/50">Name</p>
            <p className="truncate font-serif text-xl">{fullName}</p>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50">ID Number</p>
            <p className="font-mono text-sm tracking-wider text-gold">{idNumber}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Issued</p>
                <p>{fmt(enrollment)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Expires</p>
                <p>{fmt(expiry)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-3 text-[11px] text-white/60">
          {email}{phone ? ` · ${phone}` : ""}
        </div>
      </div>
    </div>
  );
}
