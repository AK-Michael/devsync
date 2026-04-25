"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Code2, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Force a repaint after autofill
  useEffect(() => {
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart') {
        const input = e.target as HTMLInputElement;
        if (input === emailRef.current || input === passwordRef.current) {
          // Force repaint by temporarily changing and restoring background
          const originalBackground = input.style.backgroundColor;
          input.style.backgroundColor = 'transparent';
          setTimeout(() => {
            input.style.backgroundColor = originalBackground;
          }, 10);
        }
      }
    };

    document.addEventListener('animationstart', handleAnimationStart);
    return () => document.removeEventListener('animationstart', handleAnimationStart);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <Code2 className="w-6 h-6 text-primary" />
        <span className="font-mono font-bold text-xl">DevSync</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to your DevSync account.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Email address
            </label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}