"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Session, AIReview, Language } from "@/types";
import { getDefaultCode } from "@/lib/utils";
import Editor from "@/components/Editor";
import Toolbar from "@/components/Toolbar";
import AIPanel from "@/components/AIPanel";
import { Code2, ArrowLeft, Brain, Code } from "lucide-react";
import Link from "next/link";
import Room from "@/components/Room";
import Presence from "@/components/Presence";

type MobileTab = "editor" | "review";

function SessionContent({ session: initialSession }: { session: Session }) {
  const supabase = createClient();

  const [session, setSession] = useState<Session>(initialSession);
  const [code, setCode] = useState(initialSession.code);
  const [review, setReview] = useState<AIReview | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("editor");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Resize state
  const [editorWidth, setEditorWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleSaveEvent() { handleSave(); }
    window.addEventListener("editor-save", handleSaveEvent);
    return () => window.removeEventListener("editor-save", handleSaveEvent);
  }, [code, session]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setEditorWidth(Math.min(Math.max(newWidth, 30), 80));
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleSave = useCallback(async () => {
    if (!session) return;
    setIsSaving(true);
    await supabase
      .from("sessions")
      .update({ code, updated_at: new Date().toISOString() })
      .eq("id", session.id);
    setIsSaving(false);
  }, [code, session]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase
        .from("sessions")
        .update({ code: newCode, updated_at: new Date().toISOString() })
        .eq("id", session.id);
    }, 2000);
  }, [session]);

  const handleLanguageChange = useCallback(async (lang: Language) => {
    const newCode = getDefaultCode(lang);
    setCode(newCode);
    setReview(null);
    setSession((prev) => ({ ...prev, language: lang, code: newCode }));
    await supabase
      .from("sessions")
      .update({ language: lang, code: newCode })
      .eq("id", session.id);
  }, [session]);

  const handleReview = useCallback(async () => {
    if (!code.trim()) return;
    setIsReviewing(true);
    setReview(null);
    // Switch to review tab on mobile automatically
    setMobileTab("review");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: session.language }),
      });
      const data = await res.json();
      setReview(data);
    } catch (err) {
      console.error("Review failed:", err);
    } finally {
      setIsReviewing(false);
    }
  }, [code, session]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* NAVBAR */}
      <nav className="h-10 border-b border-border/50 px-3 sm:px-4 flex items-center justify-between bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="text-border hidden sm:inline">|</span>
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-mono font-bold text-sm hidden sm:inline">DevSync</span>
        </div>
        <Presence />
      </nav>

      {/* TOOLBAR */}
      <Toolbar
        session={session}
        onLanguageChange={handleLanguageChange}
        onSave={handleSave}
        onReview={handleReview}
        isSaving={isSaving}
        isReviewing={isReviewing}
      />

      {/* MOBILE TAB BAR */}
      <div className="flex sm:hidden border-b border-border shrink-0">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
            mobileTab === "editor"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          onClick={() => setMobileTab("review")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
            mobileTab === "review"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          AI Review
          {review && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      </div>

      {/* DESKTOP LAYOUT — side by side */}
      <div
        ref={containerRef}
        className="hidden sm:flex flex-1 overflow-hidden relative"
      >
        <div
          style={{ width: `${editorWidth}%` }}
          className="overflow-hidden shrink-0"
        >
          <Editor
            code={code}
            language={session.language}
            onChange={handleCodeChange}
          />
        </div>

        {/* Resize handle */}
        <div
          className="relative group w-1 cursor-col-resize"
          onMouseDown={startResizing}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-border hover:bg-primary transition-colors" />
        </div>

        <div className="flex-1 border-l border-border flex flex-col overflow-hidden">
          <div className="h-10 border-b border-border px-4 flex items-center shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Review
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIPanel review={review} isReviewing={isReviewing} />
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT — tabs */}
      <div className="flex sm:hidden flex-1 overflow-hidden">
        {mobileTab === "editor" ? (
          <div className="flex-1 overflow-hidden">
            <Editor
              code={code}
              language={session.language}
              onChange={handleCodeChange}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <AIPanel review={review} isReviewing={isReviewing} />
          </div>
        )}
      </div>

    </div>
  );
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/dashboard");
        return;
      }

      setSession(data);
      setLoading(false);
    }
    fetchSession();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Code2 className="w-5 h-5 text-primary animate-pulse" />
          <span className="font-mono text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <Room roomId={session.id}>
      <SessionContent session={session} />
    </Room>
  );
}