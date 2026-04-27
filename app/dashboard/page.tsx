import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate, truncate } from "@/lib/utils";
import { Session } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Plus,
  Clock,
  Globe,
  Lock,
  LogOut,
} from "lucide-react";
import NewSessionButton from "@/components/NewSessionButton";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get the logged-in user — if none, middleware already redirected
  // but we check again here as a safety net
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch this user's sessions, newest first
  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  // Get user profile from our public users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email || "Developer";

  return (
    <div className="min-h-screen bg-background">

      {/* ---- NAVBAR ---- */}
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <span className="font-mono font-bold tracking-tight">DevSync</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {displayName}
          </span>
          {/* Sign out is a client interaction so it's in its own component */}
          <SignOutButton />
        </div>
      </nav>

      {/* ---- MAIN CONTENT ---- */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back, {displayName.split(" ")[0]} 
            </h1>
            <p className="text-muted-foreground">
              {sessions?.length || 0} session
              {sessions?.length !== 1 ? "s" : ""}
            </p>
          </div>
          {/* New Session button needs client interactivity */}
          <NewSessionButton />
        </div>

        {/* Sessions grid */}
        {!sessions || sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session: Session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ---- SUB-COMPONENTS ----
// These are small components used only on this page
// so we define them in the same file for simplicity

function SessionCard({ session }: { session: Session }) {
  return (
    <Link href={`/session/${session.id}`}>
      <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group cursor-pointer h-full">
        
        {/* Title and visibility badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {truncate(session.title, 30)}
          </h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {session.is_public ? (
              <><Globe className="w-3 h-3 mr-1" />Public</>
            ) : (
              <><Lock className="w-3 h-3 mr-1" />Private</>
            )}
          </Badge>
        </div>

        {/* Language badge */}
        <Badge className="mb-4 font-mono text-xs">
          {session.language}
        </Badge>

        {/* Code preview */}
        <pre className="text-xs text-muted-foreground bg-background rounded-lg p-3 overflow-hidden max-h-20 font-mono leading-relaxed">
          {truncate(session.code || "// empty session", 120)}
        </pre>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatDate(session.updated_at)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Code2 className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No sessions yet</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first session to start writing and reviewing code with AI.
      </p>
      <NewSessionButton />
    </div>
  );
}

// This needs "use client" because it calls supabase.auth.signOut()
// We keep it as a separate small component rather than making the
// whole dashboard a client component
function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <Button variant="ghost" size="sm" type="submit">
        <LogOut className="w-4 h-4 mr-2" />
        Sign out
      </Button>
    </form>
  );
}