"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SPECS, asPlatform, type Platform } from "@/lib/kakaoSpec";

// ---------- Profiles ----------

export async function createProfile(
  name: string,
  avatar: string | null,
  platform: Platform,
) {
  const profile = await prisma.profile.create({
    data: { name, avatar, platform },
  });
  revalidatePath("/");
  return profile;
}

export async function deleteProfile(profileId: string) {
  await prisma.profile.delete({ where: { id: profileId } });
  revalidatePath("/");
}

export async function updateProfile(
  profileId: string,
  data: { name?: string; avatar?: string | null; platform?: Platform },
) {
  await prisma.profile.update({ where: { id: profileId }, data });
  revalidatePath("/");
  revalidatePath(`/p/${profileId}`, "layout");
}

// ---------- Chat rooms ----------

export async function createChatRoom(
  profileId: string,
  partnerName: string,
  partnerAvatar: string | null,
) {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { id: profileId },
  });
  const spec = SPECS[asPlatform(profile.platform)];
  const room = await prisma.chatRoom.create({
    data: {
      profileId,
      partnerName,
      partnerAvatar,
      avatarColor: spec.defaultAvatar,
      statusBarTime: spec.defaultClock,
    },
  });
  revalidatePath(`/p/${profileId}`);
  redirect(`/p/${profileId}/room/${room.id}`);
}

export async function updateChatRoom(
  roomId: string,
  profileId: string,
  data: {
    partnerName?: string;
    partnerAvatar?: string | null;
    unreadCount?: number;
    statusBarTime?: string;
    avatarColor?: string;
    batteryLevel?: number;
    fontScale?: number;
  },
) {
  await prisma.chatRoom.update({ where: { id: roomId }, data });
  revalidatePath(`/p/${profileId}`);
  revalidatePath(`/p/${profileId}/room/${roomId}`);
}

export async function deleteChatRoom(roomId: string, profileId: string) {
  await prisma.chatRoom.delete({ where: { id: roomId } });
  revalidatePath(`/p/${profileId}`);
  redirect(`/p/${profileId}`);
}

// ---------- Messages ----------

export async function addMessage(
  roomId: string,
  profileId: string,
  data: {
    sender: "ME" | "PARTNER";
    type: "TEXT" | "IMAGE" | "DATE_DIVIDER";
    content: string;
    timeLabel: string;
    unread?: boolean;
  },
) {
  const last = await prisma.message.findFirst({
    where: { chatRoomId: roomId },
    orderBy: { order: "desc" },
  });
  await prisma.message.create({
    data: {
      chatRoomId: roomId,
      sender: data.sender,
      type: data.type,
      content: data.content,
      timeLabel: data.timeLabel,
      unread: data.unread ?? false,
      order: (last?.order ?? 0) + 1,
    },
  });
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });
  revalidatePath(`/p/${profileId}/room/${roomId}`);
  revalidatePath(`/p/${profileId}`);
}

export async function updateMessage(
  messageId: string,
  profileId: string,
  roomId: string,
  data: {
    content?: string;
    timeLabel?: string;
    sender?: "ME" | "PARTNER";
    unread?: boolean;
  },
) {
  await prisma.message.update({ where: { id: messageId }, data });
  revalidatePath(`/p/${profileId}/room/${roomId}`);
  revalidatePath(`/p/${profileId}`);
}

export async function deleteMessage(
  messageId: string,
  profileId: string,
  roomId: string,
) {
  await prisma.message.delete({ where: { id: messageId } });
  revalidatePath(`/p/${profileId}/room/${roomId}`);
  revalidatePath(`/p/${profileId}`);
}

export async function moveMessage(
  messageId: string,
  profileId: string,
  roomId: string,
  direction: "up" | "down",
) {
  const msg = await prisma.message.findUnique({ where: { id: messageId } });
  if (!msg) return;
  const neighbor = await prisma.message.findFirst({
    where: {
      chatRoomId: roomId,
      order: direction === "up" ? { lt: msg.order } : { gt: msg.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.$transaction([
    prisma.message.update({
      where: { id: msg.id },
      data: { order: neighbor.order },
    }),
    prisma.message.update({
      where: { id: neighbor.id },
      data: { order: msg.order },
    }),
  ]);
  revalidatePath(`/p/${profileId}/room/${roomId}`);
  revalidatePath(`/p/${profileId}`);
}
