import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language } from "@/types";

// This is the standard shadcn utility — it merges Tailwind classes
// safely without conflicts. e.g: cn("px-2", condition && "px-4")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generates a random hex color for a user's live cursor
export function generateUserColor(): string {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
    "#BB8FCE", "#85C1E9",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Formats a date string into something readable like "Mar 24, 2026"
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Truncates long session titles so they don't overflow the UI
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

// Maps our Language type to the format Monaco editor understands
export function getMonacoLanguage(language: Language): string {
  const map: Record<Language, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    cpp: "cpp",
    rust: "rust",
    go: "go",
    html: "html",
    css: "css",
    json: "json",
  };
  return map[language];
}

// Returns a display label for each language (used in the toolbar dropdown)
export function getLanguageLabel(language: Language): string {
  const labels: Record<Language, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    rust: "Rust",
    go: "Go",
    html: "HTML",
    css: "CSS",
    json: "JSON",
  };
  return labels[language];
}

// Generates a default code snippet when a new session is created
export function getDefaultCode(language: Language): string {
  const snippets: Record<Language, string> = {
    javascript: `// Welcome to DevSync!\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
    typescript: `// Welcome to DevSync!\nfunction greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
    python: `# Welcome to DevSync!\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
    java: `// Welcome to DevSync!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `// Welcome to DevSync!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
    rust: `// Welcome to DevSync!\nfn main() {\n    println!("Hello, World!");\n}`,
    go: `// Welcome to DevSync!\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    html: `<!-- Welcome to DevSync! -->\n<!DOCTYPE html>\n<html>\n  <head><title>Hello</title></head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>`,
    css: `/* Welcome to DevSync! */\nbody {\n  font-family: sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n}`,
    json: `{\n  "message": "Welcome to DevSync!",\n  "version": "1.0.0"\n}`,
  };
  return snippets[language];
}