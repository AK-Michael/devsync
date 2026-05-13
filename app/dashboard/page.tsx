"use client";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate, truncate } from "@/lib/utils";
import { Session } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Clock, Globe, Lock, LogOut } from "lucide-react";
import NewSessionButton from "@/components/NewSessionButton";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email || "Developer";

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="border-b border-border/50 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <span className="font-mono font-bold tracking-tight">DevSync</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[150px]">
            {displayName}
          </span>
          <SignOutButton />
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold mb-1 truncate">
              Welcome back, {displayName.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              {sessions?.length || 0} session
              {sessions?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="shrink-0">
            <NewSessionButton />
          </div>
        </div>

        {!sessions || sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {sessions.map((session: Session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <Link href={`/session/${session.id}`}>
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors text-sm sm:text-base">
            {truncate(session.title, 25)}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Badge variant="secondary" className="text-xs">
              {session.is_public ? (
                <><Globe className="w-3 h-3 mr-1" />Public</>
              ) : (
                <><Lock className="w-3 h-3 mr-1" />Private</>
              )}
            </Badge>
            <DeleteSessionButton sessionId={session.id} />
          </div>
        </div>

        <Badge className="mb-3 font-mono text-xs">
          {session.language}
        </Badge>

        <pre className="text-xs text-muted-foreground bg-background rounded-lg p-2 sm:p-3 overflow-hidden max-h-16 sm:max-h-20 font-mono leading-relaxed">
          {truncate(session.code || "// empty session", 100)}
        </pre>

        <div className="flex items-center gap-1.5 mt-3 sm:mt-4 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatDate(session.updated_at)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
        <Code2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2">No sessions yet</h2>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        Create your first session to start writing and reviewing code with AI.
      </p>
      <NewSessionButton />
    </div>
  );
}

function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <Button variant="ghost" size="sm" type="submit" className="text-xs sm:text-sm">
        <LogOut className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </form>
  );
}

function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    // Stop the click from bubbling up to the Link component
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Delete this session? This cannot be undone.")) return;

    setLoading(true);

    await fetch(`/api/session?id=${sessionId}`, {
      method: "DELETE",
    });

    setLoading(false);
    // Refresh the page to show updated list
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}