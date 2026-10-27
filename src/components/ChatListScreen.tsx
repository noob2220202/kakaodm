"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import KakaoChatList, { type KakaoListRow } from "./kakao/KakaoChatList";
import ProfileModal from "./ProfileModal";
import { createChatRoom } from "@/lib/actions";

export default function ChatListScreen({
  profileId,
  rows,
  statusBarTime,
  battery,
}: {
  profileId: string;
  rows: KakaoListRow[];
  statusBarTime: string;
  battery: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [captureMode, setCaptureMode] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  function enterCapture() {
    setCaptureMode(true);
    setShowExit(false);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }

  function exitCapture() {
    setCaptureMode(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  function flashExit() {
    setShowExit(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowExit(false), 2500);
  }

  return (
    <div
      className="fixed inset-0 bg-black flex justify-center"
      onClick={captureMode ? flashExit : undefined}
    >
      <div className="animate-list-in w-full max-w-[430px] h-full relative">
        <KakaoChatList
          rows={rows}
          statusBarTime={statusBarTime}
          battery={battery}
          onRowClick={
            captureMode
              ? undefined
              : (id) => router.push(`/p/${profileId}/room/${id}`)
          }
          onNewChat={captureMode ? undefined : () => setAdding(true)}
          onSettings={captureMode ? undefined : () => router.push("/")}
        />

        {!captureMode && rows.length === 0 && (
          <div className="absolute inset-x-0 top-[40%] flex flex-col items-center gap-3 text-gray-400 text-sm">
            <p>아직 대화방이 없어요</p>
            <button
              onClick={() => setAdding(true)}
              className="tap-feedback bg-[#fee500] text-black font-semibold rounded-lg px-4 py-2"
            >
              새 대화방 만들기
            </button>
          </div>
        )}

        {!captureMode && (
          <button
            onClick={enterCapture}
            className="tap-feedback absolute right-3 bottom-24 bg-black/70 text-white text-xs rounded-full px-3 py-2"
          >
            캡처 모드
          </button>
        )}

        {captureMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              exitCapture();
            }}
            className={`absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/75 text-white text-sm rounded-full px-4 py-2 transition-opacity duration-300 ${
              showExit ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            캡처 모드 종료
          </button>
        )}
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
