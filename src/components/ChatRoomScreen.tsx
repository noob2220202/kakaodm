"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import KakaoChatScreen, {
  type KakaoChatScreenHandle,
} from "./kakao/KakaoChatScreen";
import type { KakaoMessage } from "./kakao/MessageList";
import RoomSettingsModal, { type RoomSettings } from "./RoomSettingsModal";
import MessageEditModal from "./MessageEditModal";
import {
  addMessage,
  deleteChatRoom,
  deleteMessage,
  moveMessage,
  updateChatRoom,
  updateMessage,
} from "@/lib/actions";
import { fileToCompressedDataUrl, nowTimeLabel } from "@/lib/image";
import { SPEC } from "@/lib/kakaoSpec";

type Sender = "ME" | "PARTNER";

// Real screenshot size of the reference phone (1080px wide).
const EXPORT_WIDTH_PX = 1080;

export default function ChatRoomScreen({
  profileId,
  roomId,
  settings,
  messages,
}: {
  profileId: string;
  roomId: string;
  settings: RoomSettings;
  messages: KakaoMessage[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [captureMode, setCaptureMode] = useState(false);
  const [showCaptureControls, setShowCaptureControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState<KakaoMessage | null>(null);

  const [sender, setSender] = useState<Sender>("ME");
  const [timeLabel, setTimeLabel] = useState(nowTimeLabel);
  const [unread, setUnread] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<KakaoChatScreenHandle>(null);

  const screenProps = {
    partnerName: settings.partnerName,
    partnerAvatar: settings.partnerAvatar,
    avatarColor: settings.avatarColor,
    fontScale: settings.fontScale,
    statusBarTime: settings.statusBarTime,
    battery: settings.batteryLevel,
    messages,
  };

  function flashCaptureControls() {
    setShowCaptureControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowCaptureControls(false), 2500);
  }

  function enterCaptureMode() {
    setCaptureMode(true);
    flashCaptureControls();
    // Android Chrome hides its own status bar and address bar in fullscreen,
    // so a phone screenshot then looks exactly like the app.
    document.documentElement.requestFullscreen?.().catch(() => {});
  }

  function exitCaptureMode() {
    setCaptureMode(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  function send(type: KakaoMessage["type"], content: string) {
    startTransition(() => {
      addMessage(roomId, profileId, {
        sender: type === "DATE_DIVIDER" ? "ME" : sender,
        type,
        content,
        timeLabel: type === "DATE_DIVIDER" ? "" : timeLabel,
        unread: type === "DATE_DIVIDER" ? false : unread,
      });
    });
  }

  function handleSend() {
    const content = text.trim();
    if (!content) return;
    setText("");
    send("TEXT", content);
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      send("IMAGE", await fileToCompressedDataUrl(file));
    } finally {
      setBusy(false);
    }
  }

  function handleAddDivider() {
    const d = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const label = window.prompt(
      "날짜 구분선 문구",
      `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`,
    );
    if (label) send("DATE_DIVIDER", label);
  }

  async function handleExportPng() {
    setExporting(true);
    try {
      await document.fonts.ready;
      // let the offscreen copy mount, measure its bubbles and settle
      for (let i = 0; i < 4; i++)
        await new Promise((r) => requestAnimationFrame(r));
      const root = exportRef.current?.root;
      if (!root) return;
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(root, {
        pixelRatio: EXPORT_WIDTH_PX / SPEC.W,
        width: SPEC.W,
        height: SPEC.H,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      const now = new Date();
      a.download = `Screenshot_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}_KakaoTalk.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  }

  const exportLayer = exporting && (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        width: SPEC.W,
        pointerEvents: "none",
      }}
    >
      <KakaoChatScreen
        ref={exportRef}
        {...screenProps}
        fixedHeight
        staticScroll
      />
    </div>
  );

  if (captureMode) {
    return (
      <div
        className="fixed inset-0 z-40 bg-black flex justify-center"
        onClick={flashCaptureControls}
      >
        <div className="w-full max-w-[430px] h-full">
          <KakaoChatScreen {...screenProps} />
        </div>
        <div
          className={`absolute bottom-24 inset-x-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            showCaptureControls
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExportPng();
            }}
            className="tap-feedback bg-black/75 text-white text-sm rounded-full px-4 py-2"
          >
            {exporting ? "저장 중..." : "PNG로 저장"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              exitCaptureMode();
            }}
            className="tap-feedback bg-black/75 text-white text-sm rounded-full px-4 py-2"
          >
            캡처 모드 종료
          </button>
        </div>
        {exportLayer}
      </div>
    );
  }

  return (
    <div className="animate-push-in fixed inset-0 flex flex-col bg-[#dfe4e9]">
      <div className="h-12 shrink-0 bg-white border-b border-gray-200 flex items-center gap-1 px-2">
        <button
          onClick={() => router.push(`/p/${profileId}`)}
          className="tap-feedback h-9 px-2 rounded-lg text-sm text-gray-700"
        >
          ‹ 목록
        </button>
        <span className="flex-1 text-center text-sm font-semibold truncate">
          {settings.partnerName}
        </span>
        <button
          onClick={() => setSettingsOpen(true)}
          className="tap-feedback h-9 px-3 rounded-lg text-sm bg-gray-100"
        >
          설정
        </button>
        <button
          onClick={handleExportPng}
          disabled={exporting}
          className="tap-feedback h-9 px-3 rounded-lg text-sm bg-gray-100 disabled:opacity-50"
        >
          {exporting ? "저장 중" : "PNG"}
        </button>
        <button
          onClick={enterCaptureMode}
          className="tap-feedback h-9 px-3 rounded-lg text-sm font-semibold bg-[#fee500]"
        >
          캡처 모드
        </button>
      </div>

      <div className="flex-1 min-h-0 flex justify-center">
        <div className="w-full max-w-[430px] h-full">
          <KakaoChatScreen {...screenProps} onMessageClick={setEditing} />
        </div>
      </div>

      <div className="shrink-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-2 px-3 pt-2 pb-1.5 overflow-x-auto no-scrollbar">
            <div className="flex rounded-full bg-gray-100 p-0.5 text-xs shrink-0">
              <button
                onClick={() => setSender("PARTNER")}
                className={`tap-feedback px-3 py-1.5 rounded-full ${sender === "PARTNER" ? "bg-black text-white" : "text-gray-500"}`}
              >
                상대
              </button>
              <button
                onClick={() => setSender("ME")}
                className={`tap-feedback px-3 py-1.5 rounded-full ${sender === "ME" ? "bg-[#fee500] text-black" : "text-gray-500"}`}
              >
                나
              </button>
            </div>
            <input
              value={timeLabel}
              onChange={(e) => setTimeLabel(e.target.value)}
              className="w-[84px] shrink-0 text-xs border border-gray-200 rounded-full px-2 py-1.5 text-center focus:outline-none"
              aria-label="시간"
            />
            <label className="shrink-0 flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-1.5">
              <input
                type="checkbox"
                checked={unread}
                onChange={(e) => setUnread(e.target.checked)}
                className="accent-[#f2c200]"
              />
              안읽음 1
            </label>
            <button
              onClick={handleAddDivider}
              className="tap-feedback shrink-0 text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-1.5"
            >
              + 날짜
            </button>
          </div>
          <div className="flex items-end gap-2 px-3 pb-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              aria-label="사진 보내기"
              className="tap-feedback w-9 h-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-40"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="#333"
                strokeWidth="1.8"
              >
                <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
                <circle cx="8.5" cy="9.5" r="1.6" />
                <path d="M21 16 l-5 -5 l-8 8" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                sender === "ME" ? "내 메시지 입력" : "상대 메시지 입력"
              }
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-2xl px-3 py-2 text-sm max-h-24 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="tap-feedback h-9 px-3 rounded-full bg-[#fee500] disabled:opacity-40 text-sm font-semibold shrink-0"
            >
              전송
            </button>
          </div>
        </div>
      </div>

      {settingsOpen && (
        <RoomSettingsModal
          initial={settings}
          onCancel={() => setSettingsOpen(false)}
          onSave={(data) => {
            setSettingsOpen(false);
            startTransition(() => {
              updateChatRoom(roomId, profileId, data);
            });
          }}
          onDelete={() => {
            if (!window.confirm("이 대화방을 삭제할까요?")) return;
            setSettingsOpen(false);
            startTransition(() => {
              deleteChatRoom(roomId, profileId);
            });
          }}
        />
      )}

      {editing && (
        <MessageEditModal
          key={editing.id}
          message={editing}
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            const id = editing.id;
            setEditing(null);
            startTransition(() => {
              updateMessage(id, profileId, roomId, data);
            });
          }}
          onDelete={() => {
            const id = editing.id;
            setEditing(null);
            startTransition(() => {
              deleteMessage(id, profileId, roomId);
            });
          }}
          onMove={(dir) => {
            const id = editing.id;
            startTransition(() => {
              moveMessage(id, profileId, roomId, dir);
            });
          }}
        />
      )}

      {exportLayer}
    </div>
  );
}
