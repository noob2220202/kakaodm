"use client";

import { useState } from "react";
import KakaoAvatar from "./kakao/Avatar";
import { AVATAR_COLORS } from "@/lib/kakaoSpec";
import { fileToAvatarDataUrl } from "@/lib/image";

export type RoomSettings = {
  partnerName: string;
  partnerAvatar: string | null;
  avatarColor: string;
  unreadCount: number;
  statusBarTime: string;
  batteryLevel: number;
  fontScale: number;
};

const field =
  "border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500] w-full";

export default function RoomSettingsModal({
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  initial: RoomSettings;
  onSave: (data: RoomSettings) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof RoomSettings>(k: K, val: RoomSettings[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      set("partnerAvatar", await fileToAvatarDataUrl(file));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4">
      <div className="animate-modal-panel bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4 max-h-[92dvh] overflow-y-auto">
        <h2 className="text-lg font-bold text-center">대화방 설정</h2>

        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20">
            <KakaoAvatar
              src={v.partnerAvatar}
              color={v.avatarColor}
              size="80px"
            />
          </div>
          <div className="flex gap-2">
            <label className="tap-feedback text-sm border border-gray-300 rounded-full px-3 py-1.5 cursor-pointer">
              사진 선택
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </label>
            {v.partnerAvatar && (
              <button
                onClick={() => set("partnerAvatar", null)}
                className="tap-feedback text-sm border border-gray-300 rounded-full px-3 py-1.5"
              >
                기본 프로필로
              </button>
            )}
          </div>
          {!v.partnerAvatar && (
            <div className="flex gap-2 flex-wrap justify-center">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.key}
                  aria-label={c.key}
                  onClick={() => set("avatarColor", c.key)}
                  className={`tap-feedback w-7 h-7 rounded-lg ${v.avatarColor === c.key ? "ring-2 ring-black ring-offset-2" : ""}`}
                  style={{ background: c.base }}
                />
              ))}
            </div>
          )}
          {busy && <span className="text-xs text-gray-400">처리 중...</span>}
        </div>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          상대방 이름
          <input
            value={v.partnerName}
            onChange={(e) => set("partnerName", e.target.value)}
            className={field}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            상태바 시계
            <input
              value={v.statusBarTime}
              onChange={(e) => set("statusBarTime", e.target.value)}
              placeholder="비우면 숨김"
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            배터리 %
            <input
              type="number"
              min={0}
              max={100}
              value={v.batteryLevel}
              onChange={(e) =>
                set(
                  "batteryLevel",
                  Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                )
              }
              className={field}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          글자 크기 ({Math.round(v.fontScale * 100)}%)
          <input
            type="range"
            min={0.8}
            max={1.3}
            step={0.01}
            value={v.fontScale}
            onChange={(e) => set("fontScale", Number(e.target.value))}
            className="accent-[#3c1e1e]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          대화목록에 표시할 안읽은 메시지 수
          <input
            type="number"
            min={0}
            value={v.unreadCount}
            onChange={(e) =>
              set("unreadCount", Math.max(0, Number(e.target.value) || 0))
            }
            className={field}
          />
        </label>

        <div className="flex flex-col gap-2 mt-1">
          <button
            disabled={!v.partnerName.trim() || busy}
            onClick={() => onSave({ ...v, partnerName: v.partnerName.trim() })}
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
