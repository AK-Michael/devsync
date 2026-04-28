"use client";

import { Language, Session } from "@/types";
import { getLanguageLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Save, Share2, ChevronDown, Check, Loader2 } from "lucide-react";
import { useState } from "react";

const LANGUAGES: Language[] = [
  "javascript", "typescript", "python",
  "java", "cpp", "rust", "go",
  "html", "css", "json",
];

type Props = {
  session: Session;
  onLanguageChange: (lang: Language) => void;
  onSave: () => void;
  onReview: () => void;
  isSaving: boolean;
  isReviewing: boolean;
};

export default function Toolbar({
  session,
  onLanguageChange,
  onSave,
  onReview,
  isSaving,
  isReviewing,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="h-12 sm:h-14 border-b border-border bg-card flex items-center justify-between px-3 sm:px-4 gap-2 sm:gap-3 shrink-0">

      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="font-mono font-semibold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[180px] hidden xs:block">
          {session.title}
        </h1>

        {/* Language dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-xs font-mono transition-colors"
          >
            {getLanguageLabel(session.language)}
            <ChevronDown className="w-3 h-3" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 bg-black border border-border rounded-lg shadow-xl z-20 py-1 min-w-[130px] sm:min-w-[140px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono hover:bg-secondary transition-colors text-white"
                  >
                    {getLanguageLabel(lang)}
                    {lang === session.language && (
                      <Check className="w-3 h-3 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="font-mono text-xs h-7 sm:h-9 px-2 sm:px-3"
        >
          {copied ? (
            <><Check className="w-3 h-3 sm:mr-1.5 text-primary" /><span className="hidden sm:inline">Copied!</span></>
          ) : (
            <><Share2 className="w-3 h-3 sm:mr-1.5" /><span className="hidden sm:inline">Share</span></>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="font-mono text-xs h-7 sm:h-9 px-2 sm:px-3"
        >
          {isSaving ? (
            <><Loader2 className="w-3 h-3 animate-spin sm:mr-1.5" /><span className="hidden sm:inline">Saving...</span></>
          ) : (
            <><Save className="w-3 h-3 sm:mr-1.5" /><span className="hidden sm:inline">Save</span></>
          )}
        </Button>

        <Button
          size="sm"
          onClick={onReview}
          disabled={isReviewing}
          className="font-mono text-xs h-7 sm:h-9 px-2 sm:px-3"
        >
          {isReviewing ? (
            <><Loader2 className="w-3 h-3 animate-spin sm:mr-1.5" /><span className="hidden sm:inline">Reviewing...</span></>
          ) : (
            <><Play className="w-3 h-3 sm:mr-1.5" /><span className="hidden sm:inline">Review</span></>
          )}
        </Button>
      </div>
    </div>
  );
}