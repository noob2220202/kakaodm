import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatListScreen from "@/components/ChatListScreen";
import { SPECS, asPlatform } from "@/lib/kakaoSpec";

export const dynamic = "force-dynamic";

export default async function ChatListPage({
  params,
}: PageProps<"/p/[profileId]">) {
  const { profileId } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });
  if (!profile) notFound();

  const rooms = await prisma.chatRoom.findMany({
    where: { profileId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        where: { type: { not: "DATE_DIVIDER" } },
        orderBy: { order: "desc" },
        take: 1,
      },
    },
  });

  const rows = rooms.map((r) => {
    const last = r.messages[0];
    return {
      id: r.id,
      name: r.partnerName,
      avatar: r.partnerAvatar,
      avatarColor: r.avatarColor,
      preview: last
        ? last.type === "IMAGE"
          ? "사진을 보냈습니다."
          : last.content
        : "",
      time: last?.timeLabel ?? "",
      unread: r.unreadCount,
    };
  });

  const latest = rooms[0];
  return (
    <ChatListScreen
      platform={asPlatform(profile.platform)}
      profileId={profileId}
      rows={rows}
      statusBarTime={
        latest?.statusBarTime ??
        SPECS[asPlatform(profile.platform)].defaultClock
      }
      battery={latest?.batteryLevel ?? 76}
    />
  );
}
