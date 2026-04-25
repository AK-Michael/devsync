'use client';

import { AIReview, Bug, Suggestion } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Brain, Bug as BugIcon, Lightbulb, Zap, AlertCircle } from 'lucide-react';

type Props = {
  review: AIReview | null;
  isReviewing: boolean;
};

const SEVERITY_COLOR: Record<Bug['severity'], string> = {
  low: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AIPanel({ review, isReviewing }: Props) {

  if (isReviewing) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-4 p-6'>
        <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse'>
          <Brain className='w-6 h-6 text-primary' />
        </div>
        <div className='text-center'>
          <p className='font-medium text-sm mb-1'>Reviewing your code...</p>
          <p className='text-muted-foreground text-xs'>
            Claude is analyzing bugs, complexity, and improvements
          </p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-4 p-6 text-center'>
        <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
          <Brain className='w-6 h-6 text-primary' />
        </div>
        <div>
          <p className='font-medium text-sm mb-1'>AI Code Review</p>
          <p className='text-muted-foreground text-xs leading-relaxed'>
            Click the Review button to get instant feedback on bugs,
            complexity, and improvements.
          </p>
        </div>
      </div>
    );
  }

  const bugs = review.bugs ?? [];
  const suggestions = review.suggestions ?? [];
  const complexity = review.complexity ?? null;
  const summary = review.summary ?? '';

  return (
    <ScrollArea className='h-full '>
      <div className='p-4 space-y-5  '>

        {summary ? (
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Brain className='w-4 h-4 text-primary' />
              <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Summary
              </h3>
            </div>
            <p className='text-sm leading-relaxed text-foreground/90'>{summary}</p>
          </div>
        ) : null}

        {complexity ? (
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Zap className='w-4 h-4 text-primary' />
              <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Complexity
              </h3>
            </div>
            <div className='flex gap-2 mb-2'>
              <Badge variant='secondary' className='font-mono text-xs'>
                Time: {complexity.time}
              </Badge>
              <Badge variant='secondary' className='font-mono text-xs'>
                Space: {complexity.space}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {complexity.explanation}
            </p>
          </div>
        ) : null}

        <div>
          <div className='flex items-center gap-2 mb-2'>
            <BugIcon className='w-4 h-4 text-primary' />
            <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Bugs ({bugs.length})
            </h3>
          </div>
          {bugs.length === 0 ? (
            <p className='text-xs text-muted-foreground'>No bugs found. Great work!</p>
          ) : (
            <div className='space-y-2'>
              {bugs.map((bug: Bug, i: number) => (
                <div
                  key={i}
                  className={'rounded-lg border p-3 text-xs ' + SEVERITY_COLOR[bug.severity]}
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span className='font-semibold capitalize'>{bug.severity} severity</span>
                    {bug.line && (
                      <span className='font-mono opacity-70'>Line {bug.line}</span>
                    )}
                  </div>
                  <p className='mb-2 opacity-90'>{bug.message}</p>
                  <p className='opacity-70'><span className='font-semibold'>Fix: </span>{bug.fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Lightbulb className='w-4 h-4 text-primary' />
            <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Suggestions ({suggestions.length})
            </h3>
          </div>
          {suggestions.length === 0 ? (
            <p className='text-xs text-muted-foreground'>No suggestions.</p>
          ) : (
            <div className='space-y-2'>
              {suggestions.map((s: Suggestion, i: number) => (
                <div
                  key={i}
                  className='rounded-lg border border-border bg-secondary/30 p-3 text-xs'
                >
                  <div className='flex items-start gap-2 mb-2'>
                    <AlertCircle className='w-3 h-3 text-primary mt-0.5 shrink-0' />
                    <p>{s.message}</p>
                  </div>
                  {s.improved_code && (
                    <pre className='bg-background rounded p-2 font-mono text-xs overflow-x-auto text-primary/80'>
                      {s.improved_code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </ScrollArea>
  );
}
