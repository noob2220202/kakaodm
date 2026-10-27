"use client";

import { useState } from "react";
import AvatarImage from "./AvatarImage";
import { fileToAvatarDataUrl } from "@/lib/image";
import { PLATFORMS, type Platform } from "@/lib/kakaoSpec";

export default function ProfileModal({
  initialName = "",
  initialAvatar = null,
  initialPlatform,
  title,
  confirmLabel,
  onConfirm,
  onCancel,
  onDelete,
}: {
  initialName?: string;
  initialAvatar?: string | null;
  /** When set, the modal also asks which phone's KakaoTalk to imitate. */
  initialPlatform?: Platform;
  title: string;
  confirmLabel: string;
  onConfirm: (name: string, avatar: string | null, platform: Platform) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [platform, setPlatform] = useState<Platform>(
    initialPlatform ?? "android",
  );
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
      <div className="animate-modal-panel bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        <h2 className="text-lg font-bold text-center">{title}</h2>

        <div className="flex flex-col items-center gap-3">
          <label className="relative cursor-pointer group">
            <AvatarImage src={avatar} alt={name || "?"} size={96} />
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

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          className="border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-[#fee500]"
        />

        {initialPlatform && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-600 text-center">
              어떤 폰 카톡으로 만들까요?
            </span>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`tap-feedback flex-1 rounded-lg py-2.5 text-sm font-medium ${
                    platform === p.key
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            disabled={!name.trim() || busy}
            onClick={() => onConfirm(name.trim(), avatar, platform)}
            className="tap-feedback bg-[#fee500] disabled:opacity-40 text-black font-semibold rounded-lg py-2.5"
          >
            {confirmLabel}
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="tap-feedback text-red-500 text-sm py-1"
            >
              삭제
            </button>
          )}
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
