import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: profile?.full_name || user.email || "Anonymous",
      color,
      avatar: profile?.avatar_url || "",
    },
  });

  const { room } = await request.json();
  session.allow(room, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new NextResponse(body, { status });
}
