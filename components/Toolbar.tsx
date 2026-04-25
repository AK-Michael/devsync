'use client';

import { Language, Session } from '@/types';
import { getLanguageLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Save,
  Share2,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';

const LANGUAGES: Language[] = [
  'javascript', 'typescript', 'python',
  'java', 'cpp', 'rust', 'go',
  'html', 'css', 'json',
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
    <div className='h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-3'>

      {/* Left — session title + language picker */}
      <div className='flex items-center gap-3 min-w-0'>
        <h1 className='font-mono font-semibold text-sm truncate max-w-[180px]'>
          {session.title}
        </h1>

        {/* Language dropdown */}
        <div className='relative'>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary hover:cursor-pointer text-xs font-mono transition-colors'
          >
            {getLanguageLabel(session.language)}
            <ChevronDown className='w-3 h-3' />
          </button>

          {showDropdown && (
            <>
              {/* Invisible overlay to close dropdown on outside click */}
              <div
                className='fixed inset-0 z-10'
                onClick={() => setShowDropdown(false)}
              />
              <div className='absolute top-full left-0 mt-1 bg-black border border-border rounded-lg shadow-xl z-20 py-1 min-w-[140px]'>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setShowDropdown(false);
                    }}
                    className='w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono hover:cursor-pointer transition-colors'
                  >
                    {getLanguageLabel(lang)}
                    {lang === session.language && (
                      <Check className='w-3 h-3 text-primary' />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Badge variant='secondary' className='text-xs font-mono hidden sm:flex'>
          {session.is_public ? 'Public' : 'Private'}
        </Badge>
      </div>

      {/* Right — action buttons */}
      <div className='flex items-center gap-2 shrink-0'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleShare}
          className='font-mono text-xs hover:cursor-pointer'
        >
          {copied ? (
            <><Check className='w-3 h-3 mr-1.5 text-primary' />Copied!</>
          ) : (
            <><Share2 className='w-3 h-3 mr-1.5' />Share</>
          )}
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={onSave}
          disabled={isSaving}
          className='font-mono text-xs hover:cursor-pointer'
        >
          {isSaving ? (
            <><Loader2 className='w-3 h-3 mr-1.5 animate-spin' />Saving...</>
          ) : (
            <><Save className='w-3 h-3 mr-1.5' />Save</>
          )}
        </Button>

        <Button
          size='sm'
          onClick={onReview}
          disabled={isReviewing}
          className='font-mono text-xs hover:cursor-pointer'
        >
          {isReviewing ? (
            <><Loader2 className='w-3 h-3 mr-1.5 animate-spin' />Reviewing...</>
          ) : (
            <><Play className='w-3 h-3 mr-1.5' />Review</>
          )}
        </Button>
      </div>
    </div>
  );
}
