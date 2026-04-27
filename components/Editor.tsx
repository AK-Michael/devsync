"use client";

import { useRef } from "react";
import MonacoEditor, { OnMount, OnChange } from "@monaco-editor/react";
import { Language } from "@/types";
import { getMonacoLanguage } from "@/lib/utils";

type Props = {
  code: string;
  language: Language;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export default function Editor({
  code,
  language,
  onChange,
  readOnly = false,
}: Props) {
  const editorRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        window.dispatchEvent(new CustomEvent("editor-save"));
      }
    );

    // Mark as unmounted on dispose to suppress cancelation errors
    editor.onDidDispose(() => {
      mountedRef.current = false;
    });
  };

  const handleChange: OnChange = (value) => {
    if (mountedRef.current) {
      onChange(value || "");
    }
  };

  return (
    <MonacoEditor
      height="100%"
      language={getMonacoLanguage(language)}
      value={code}
      theme="vs-dark"
      onChange={handleChange}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: "monospace",
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 2,
        automaticLayout: true,
        readOnly,
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        renderLineHighlight: "line",
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}