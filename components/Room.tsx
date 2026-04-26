"use client";

import { RoomProvider } from "@/lib/liveblocks";
import { ReactNode } from "react";

type Props = {
  roomId: string;
  children: ReactNode;
};

export default function Room({ roomId, children }: Props) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        name: "",
        color: "",
      }}
    >
      {children}
    </RoomProvider>
  );
}