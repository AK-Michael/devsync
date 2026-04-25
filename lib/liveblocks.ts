import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

export type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
};

export type Storage = {};

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useSelf,
  useUpdateMyPresence,
} = createRoomContext<Presence, Storage>(client);
