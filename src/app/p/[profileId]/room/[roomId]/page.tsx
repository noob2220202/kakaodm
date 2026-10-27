import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatRoomScreen from "@/components/ChatRoomScreen";

export const dynamic = "force-dynamic";

export default async function RoomPage({
  params,
}: PageProps<"/p/[profileId]/room/[roomId]">) {
  const { profileId, roomId } = await params;

  const room = await prisma.chatRoom.findFirst({
    where: { id: roomId, profileId },
    include: { messages: { orderBy: { order: "asc" } } },
  });
  if (!room) notFound();

  return (
    <ChatRoomScreen
      profileId={profileId}
      roomId={room.id}
      settings={{
        partnerName: room.partnerName,
        partnerAvatar: room.partnerAvatar,
        avatarColor: room.avatarColor,
        unreadCount: room.unreadCount,
        statusBarTime: room.statusBarTime,
        batteryLevel: room.batteryLevel,
        fontScale: room.fontScale,
      }}
      messages={room.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        type: m.type,
        content: m.content,
        timeLabel: m.timeLabel,
        unread: m.unread,
      }))}
    />
  );
}
