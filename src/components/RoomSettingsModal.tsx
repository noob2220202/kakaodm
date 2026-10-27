"use client";

import { useState } from "react";
import AvatarImage from "./AvatarImage";
import { fileToAvatarDataUrl } from "@/lib/image";

export default function RoomSettingsModal({
  initialName,
  initialAvatar,
  initialUnread,
  initialStatusBarTime,
  onSave,
  onCancel,
  onDelete,
}: {
  initialName: string;
  initialAvatar: string | null;
  initialUnread: number;
  initialStatusBarTime: string;
  onSave: (data: {
    partnerName: string;
    partnerAvatar: string | null;
    unreadCount: number;
    statusBarTime: string;
  }) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [unread, setUnread] = useState(String(initialUnread));
  const [statusTime, setStatusTime] = useState(initialStatusBarTime);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      setAvatar(await fileToAvatarDataUrl(file));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="animate-modal-panel bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-center">대화방 설정</h2>

        <div className="flex flex-col items-center gap-2">
          <label className="relative cursor-pointer group">
            <AvatarImage src={avatar} alt={name || "?"} size={88} />
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100">
              사진 변경
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {busy && <span className="text-xs text-gray-400">처리 중...</span>}
        </div>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          상대방 이름
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          목록 안읽은 메시지 수
          <input
            type="number"
            min={0}
            value={unread}
            onChange={(e) => setUnread(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          상태바 시간 (캡처용)
          <input
            value={statusTime}
            onChange={(e) => setStatusTime(e.target.value)}
            placeholder="오후 9:41"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500]"
          />
        </label>

        <div className="flex flex-col gap-2 mt-2">
          <button
            disabled={!name.trim() || busy}
            onClick={() =>
              onSave({
                partnerName: name.trim(),
                partnerAvatar: avatar,
                unreadCount: Math.max(0, parseInt(unread || "0", 10) || 0),
                statusBarTime: statusTime.trim() || "오후 9:41",
              })
            }
            className="tap-feedback bg-[#fee500] disabled:opacity-40 text-black font-semibold rounded-lg py-2.5"
          >
            저장
          </button>
          <button
            onClick={onDelete}
            className="tap-feedback text-red-500 text-sm py-1"
          >
            대화방 삭제
          </button>
          <button
            onClick={onCancel}
            className="tap-feedback text-gray-500 text-sm py-1"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
