import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
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