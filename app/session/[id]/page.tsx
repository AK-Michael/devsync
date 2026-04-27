"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Session, AIReview, Language } from "@/types";
import { getDefaultCode } from "@/lib/utils";
import Editor from "@/components/Editor";
import Toolbar from "@/components/Toolbar";
import AIPanel from "@/components/AIPanel";
import Presence from "@/components/Presence";
import Room from "@/components/Room";
import { Code2, ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";

function SessionContent({ session: initialSession }: { session: Session }) {
  const supabase = createClient();

  const [session, setSession] = useState<Session>(initialSession);
  const [code, setCode] = useState(initialSession.code);
  const [review, setReview] = useState<AIReview | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Resize state
  const [editorWidth, setEditorWidth] = useState(60); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleSaveEvent() {
      handleSave();
    }
    window.addEventListener("editor-save", handleSaveEvent);
    return () => window.removeEventListener("editor-save", handleSaveEvent);
  }, [code, session]);

  // Resize handlers
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      // Limit min/max width (30% to 80% of container)
      setEditorWidth(Math.min(Math.max(newWidth, 30), 80));
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
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
      <nav className="h-10 border-b border-border/50 px-4 flex items-center justify-between bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs hover:cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            Dashboard
          </Link>
          <span className="text-border">|</span>
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-mono font-bold text-sm">DevSync</span>
        </div>
        <Presence />
      </nav>

      <Toolbar
        session={session}
        onLanguageChange={handleLanguageChange}
        onSave={handleSave}
        onReview={handleReview}
        isSaving={isSaving}
        isReviewing={isReviewing}
      />

      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {/* Editor Panel */}
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
        
        {/* Resize Handle */}
        <div
          className="relative group"
          onMouseDown={startResizing}
          style={{ cursor: 'col-resize' }}
        >
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-border hover:bg-primary active:bg-primary transition-colors group-hover:bg-primary/50" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 rounded-md bg-border/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        
        {/* AI Panel */}
        <div className="flex-1 border-l border-border flex flex-col overflow-hidden">
          <div className="h-10 border-b border-border px-4 flex items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Review
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIPanel review={review} isReviewing={isReviewing} />
          </div>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-background ">
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