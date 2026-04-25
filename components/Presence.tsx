"use client";

import { useOthers, useSelf } from "@/lib/liveblocks";

export default function Presence() {
  const others = useOthers();
  const self = useSelf();

  return (
    <div className="flex items-center gap-1">
      {/* Show yourself first */}
      {self && (
        <div key={`self-${self.id}`} className="relative group">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-background cursor-default select-none"
            style={{ backgroundColor: self.info?.color || "#888" }}
          >
            {(self.info?.name || "?")[0].toUpperCase()}
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-popover border border-border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {self.info?.name || "Anonymous"} (you)
          </div>
        </div>
      )}

      {/* Show other users */}
      {others.map((other) => (
        <div key={`other-${other.connectionId}`} className="relative group">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-background cursor-default select-none"
            style={{ backgroundColor: other.info?.color || "#888" }}
          >
            {(other.info?.name || "?")[0].toUpperCase()}
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-popover border border-border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {other.info?.name || "Anonymous"}
          </div>
        </div>
      ))}
    </div>
  );
}