import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatListScreen from "@/components/ChatListScreen";

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

  const roomData = rooms.map((r) => {
    const last = r.messages[0];
    const preview = last
      ? last.type === "IMAGE"
        ? "사진"
        : last.content
      : "대화를 시작해보세요";
    return {
      id: r.id,
      partnerName: r.partnerName,
      partnerAvatar: r.partnerAvatar,
      unreadCount: r.unreadCount,
      preview,
      time: last?.timeLabel ?? "",
    };
  });

  return (
    <ChatListScreen
      profileId={profileId}
      profileName={profile.name}
      rooms={roomData}
    />
  );
}
