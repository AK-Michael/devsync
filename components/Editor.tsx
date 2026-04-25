'use client';

import { useRef, useEffect } from 'react';
import MonacoEditor, { OnMount, OnChange } from '@monaco-editor/react';
import { Language } from '@/types';
import { getMonacoLanguage } from '@/lib/utils';
import * as monaco from 'monaco-editor';

type Props = {
  code: string;
  language: Language;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export default function Editor({ code, language, onChange, readOnly = false }: Props) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Called once when the editor finishes mounting
  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Focus the editor automatically when the page loads
    editor.focus();

    // Add keyboard shortcut: Ctrl+S / Cmd+S to trigger save
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        // Dispatch a custom event that the parent page listens for
        window.dispatchEvent(new CustomEvent('editor-save'));
      }
    );
  };

  const handleChange: OnChange = (value) => {
    onChange(value || '');
  };

  return (
    
    <MonacoEditor
      height='100%'
      language={getMonacoLanguage(language)}
      value={code}
      theme='vs-dark'
      onChange={handleChange}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: 'var(--font-geist-mono), monospace',
        fontLigatures: true,
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        automaticLayout: true, // resizes editor when container resizes
        readOnly,
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        renderLineHighlight: 'line',
        bracketPairColorization: { enabled: true },
      }}
    />
  
  );
  
}
