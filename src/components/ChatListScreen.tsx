"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AvatarImage from "./AvatarImage";
import ProfileModal from "./ProfileModal";
import { createChatRoom } from "@/lib/actions";
import { IconBack, IconPlus } from "./icons";

type Room = {
  id: string;
  partnerName: string;
  partnerAvatar: string | null;
  unreadCount: number;
  preview: string;
  time: string;
};

export default function ChatListScreen({
  profileId,
  profileName,
  rooms,
}: {
  profileId: string;
  profileName: string;
  rooms: Room[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);

  return (
    <div className="animate-screen-in flex-1 flex flex-col bg-white max-w-[480px] w-full mx-auto sm:border-x border-gray-200 min-h-screen">
      <header className="flex items-center justify-between px-1 h-[52px] shrink-0 bg-white">
        <button
          onClick={() => router.push("/")}
          className="w-11 h-11 flex items-center justify-center text-black active:scale-90 active:bg-black/5 rounded-full transition-transform duration-100"
          aria-label="프로필 전환"
        >
          <IconBack className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-[19px]">{profileName}</h1>
        <button
          onClick={() => setAdding(true)}
          className="w-11 h-11 flex items-center justify-center text-black active:scale-90 active:bg-black/5 rounded-full transition-transform duration-100"
          aria-label="새 대화방"
        >
          <IconPlus className="w-5 h-5" />
        </button>
      </header>
      <div className="px-4 pb-2 pt-1">
        <span className="inline-block bg-black text-white text-xs font-medium rounded-full px-3 py-1.5">
          전체
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
            <p>아직 대화방이 없어요</p>
            <button
              onClick={() => setAdding(true)}
              className="tap-feedback bg-[#fee500] text-black font-semibold rounded-lg px-4 py-2 text-sm"
            >
              새 대화방 만들기
            </button>
          </div>
        )}
        {rooms.map((r) => (
          <button
            key={r.id}
            onClick={() => router.push(`/p/${profileId}/room/${r.id}`)}
            className="tap-feedback w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
          >
            <AvatarImage src={r.partnerAvatar} alt={r.partnerName} size={56} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px] truncate">
                {r.partnerName}
              </p>
              <p className="text-sm text-gray-400 truncate">{r.preview}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-xs text-gray-400">{r.time}</span>
              {r.unreadCount > 0 && (
                <span className="bg-[#ff3b30] text-white text-[11px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {r.unreadCount > 99 ? "99+" : r.unreadCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {adding && (
        <ProfileModal
          title="새 대화방"
          confirmLabel="만들기"
          onCancel={() => setAdding(false)}
          onConfirm={(name, avatar) => {
            setAdding(false);
            startTransition(() => {
              createChatRoom(profileId, name, avatar);
            });
          }}
        />
      )}
    </div>
  );
}
