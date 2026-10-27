"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AvatarImage from "./AvatarImage";
import ProfileModal from "./ProfileModal";
import { createProfile, deleteProfile, updateProfile } from "@/lib/actions";
import type { Platform } from "@/lib/kakaoSpec";

type Profile = {
  id: string;
  name: string;
  avatar: string | null;
  platform: Platform;
};

export default function ProfilePicker({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [adding, setAdding] = useState(false);

  function select(p: Profile) {
    if (editMode) {
      setEditing(p);
    } else {
      router.push(`/p/${p.id}`);
    }
  }

  return (
    <div className="animate-screen-in flex-1 flex flex-col items-center justify-center gap-10 py-16 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
        누구의 카톡인가요?
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => select(p)}
            className="tap-feedback flex flex-col items-center gap-2 group"
          >
            <div className="relative">
              <AvatarImage
                src={p.avatar}
                alt={p.name}
                size={96}
                className="ring-2 ring-transparent group-hover:ring-[#fee500] transition text-2xl"
              />
              {editMode && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-sm">
                  편집
                </div>
              )}
            </div>
            <span className="text-sm text-gray-700 group-hover:text-black max-w-[96px] truncate">
              {p.name}
            </span>
            <span className="text-[11px] text-gray-400 -mt-1.5">
              {p.platform === "ios" ? "아이폰" : "안드로이드"}
            </span>
          </button>
        ))}

        <button
          onClick={() => setAdding(true)}
          className="tap-feedback flex flex-col items-center gap-2 group"
        >
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-3xl text-gray-300 group-hover:border-gray-400 group-hover:text-gray-400 transition">
            +
          </div>
          <span className="text-sm text-gray-400">프로필 추가</span>
        </button>
      </div>

      {profiles.length > 0 && (
        <button
          onClick={() => setEditMode((v) => !v)}
          className="tap-feedback text-sm text-gray-500 border border-gray-300 rounded px-4 py-1.5 hover:bg-gray-100"
        >
          {editMode ? "완료" : "프로필 관리"}
        </button>
      )}

      {adding && (
        <ProfileModal
          title="새 프로필"
          initialPlatform="android"
          confirmLabel="만들기"
          onCancel={() => setAdding(false)}
          onConfirm={(name, avatar, platform) => {
            setAdding(false);
            startTransition(() => {
              createProfile(name, avatar, platform);
            });
          }}
        />
      )}

      {editing && (
        <ProfileModal
          title="프로필 수정"
          confirmLabel="저장"
          initialName={editing.name}
          initialAvatar={editing.avatar}
          initialPlatform={editing.platform}
          onCancel={() => setEditing(null)}
          onConfirm={(name, avatar, platform) => {
            const id = editing.id;
            setEditing(null);
            startTransition(() => {
              updateProfile(id, { name, avatar, platform });
            });
          }}
          onDelete={() => {
            const id = editing.id;
            setEditing(null);
            startTransition(() => {
              deleteProfile(id);
            });
          }}
        />
      )}
    </div>
  );
}
