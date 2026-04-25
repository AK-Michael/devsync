import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Zap,
  Users,
  Brain,
  ArrowRight,
  Github,
} from "lucide-react";

// Feature cards data
const features = [
  {
    icon: Brain,
    title: "AI Code Review",
    description:
      "Get instant feedback on bugs, complexity, and improvements as you type — powered by Claude.",
  },
  {
    icon: Users,
    title: "Live Collaboration",
    description:
      "Invite teammates to your session. See their cursors, edits, and AI suggestions in real time.",
  },
  {
    icon: Zap,
    title: "10+ Languages",
    description:
      "JavaScript, TypeScript, Python, Rust, Go, Java, C++ and more — all with full syntax highlighting.",
  },
  {
    icon: Code2,
    title: "VS Code Powered",
    description:
      "Built on Monaco — the same engine that powers VS Code. Familiar shortcuts, same experience.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* ---- NAVBAR ---- */}
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="font-mono font-bold text-lg tracking-tight">
            DevSync
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">

        {/* Background glow effect — pure CSS, no images */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <Badge variant="secondary" className="mb-6 font-mono">
          AI-Powered · Real-Time · Open Sessions
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
          Code smarter.
          <br />
          <span className="text-primary">Review faster.</span>
          <br />
          Ship together.
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10">
          DevSync gives you an AI co-reviewer that catches bugs, explains
          complexity, and suggests improvements — while your team collaborates
          live in the same editor.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/signup">
            <Button size="lg" className="font-mono">
              Start coding free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="font-mono">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </Link>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything you need to write better code
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Built for developers who care about code quality and want AI that
          actually understands their code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-border px-6 py-8 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-mono font-bold text-foreground">DevSync</span>
        </div>
        <p>Built with Next.js, Supabase, and Claude AI.</p>
      </footer>
    </main>
  );
}