"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import StatusBar from "./StatusBar";
import MessageBubble, { UIMessage } from "./MessageBubble";
import RoomSettingsModal from "./RoomSettingsModal";
import MessageEditModal from "./MessageEditModal";
import { IconBack, IconCamera, IconSettings } from "./icons";
import {
  addMessage,
  deleteChatRoom,
  deleteMessage,
  updateChatRoom,
  updateMessage,
} from "@/lib/actions";
import { fileToCompressedDataUrl, nowTimeLabel } from "@/lib/image";

type Sender = "ME" | "PARTNER";

function computeFlags(messages: UIMessage[]) {
  return messages.map((m, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const sameSenderAsPrev =
      !!prev && prev.type !== "DATE_DIVIDER" && prev.sender === m.sender;
    const showAvatarAndName = m.sender === "PARTNER" && !sameSenderAsPrev;
    const showTime =
      !next ||
      next.type === "DATE_DIVIDER" ||
      next.sender !== m.sender ||
      next.timeLabel !== m.timeLabel;
    return { message: m, showAvatarAndName, showTime };
  });
}

export default function ChatRoomScreen({
  profileId,
  roomId,
  partnerName,
  partnerAvatar,
  unreadCount,
  statusBarTime,
  messages,
}: {
  profileId: string;
  roomId: string;
  partnerName: string;
  partnerAvatar: string | null;
  unreadCount: number;
  statusBarTime: string;
  messages: UIMessage[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [captureMode, setCaptureMode] = useState(false);
  const [showExitBar, setShowExitBar] = useState(true);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<UIMessage | null>(
    null,
  );

  const [sender, setSender] = useState<Sender>("ME");
  const [timeLabel, setTimeLabel] = useState(nowTimeLabel());
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  function enterCaptureMode() {
    setCaptureMode(true);
    setShowExitBar(true);
    exitTimer.current = setTimeout(() => setShowExitBar(false), 2500);
  }

  function exitCaptureMode() {
    setCaptureMode(false);
    if (exitTimer.current) clearTimeout(exitTimer.current);
  }

  function handleCaptureTap() {
    setShowExitBar(true);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => setShowExitBar(false), 2500);
  }

  function handleSend() {
    const content = text.trim();
    if (!content) return;
    setText("");
    startTransition(() => {
      addMessage(roomId, profileId, {
        sender,
        type: "TEXT",
        content,
        timeLabel,
      });
    });
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      startTransition(() => {
        addMessage(roomId, profileId, {
          sender,
          type: "IMAGE",
          content: dataUrl,
          timeLabel,
        });
      });
    } finally {
      setBusy(false);
    }
  }

  function handleAddDivider() {
    const label = window.prompt(
      "구분선에 표시할 날짜/문구를 입력하세요",
      "2024년 3월 14일 금요일",
    );
    if (!label) return;
    startTransition(() => {
      addMessage(roomId, profileId, {
        sender: "ME",
        type: "DATE_DIVIDER",
        content: label,
        timeLabel: "",
      });
    });
  }

  function handleDeleteMessage(id: string) {
    if (!window.confirm("이 메시지를 삭제할까요?")) return;
    startTransition(() => {
      deleteMessage(id, profileId, roomId);
    });
  }

  async function handleExportPng() {
    if (!captureRef.current) return;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(captureRef.current, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${partnerName}_카톡.png`;
    a.click();
  }

  const flagged = computeFlags(messages);

  const header = (
    <div className="relative flex items-center justify-between px-1 h-[52px] shrink-0 bg-white border-b border-black/5">
      <button
        onClick={() => router.push(`/p/${profileId}`)}
        className="w-11 h-11 flex items-center justify-center text-black active:scale-90 active:bg-black/5 rounded-full transition-transform duration-100"
        aria-label="뒤로"
      >
        <IconBack className="w-6 h-6" />
      </button>
      <h1 className="font-semibold text-[17px] text-black truncate absolute left-1/2 -translate-x-1/2 pointer-events-none">
        {partnerName}
      </h1>
      <div className="flex items-center">
        {!captureMode && (
          <>
            <button
              onClick={enterCaptureMode}
              aria-label="캡처 모드"
              className="w-11 h-11 flex items-center justify-center text-black active:scale-90 active:bg-black/5 rounded-full transition-transform duration-100"
              title="캡처 모드"
            >
              <IconCamera className="w-[22px] h-[22px]" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="대화방 설정"
              className="w-11 h-11 flex items-center justify-center text-black active:scale-90 active:bg-black/5 rounded-full transition-transform duration-100"
              title="대화방 설정"
            >
              <IconSettings className="w-[22px] h-[22px]" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const chatArea = (
    <div
      ref={scrollRef}
      className="kakao-chat-bg flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 py-3"
    >
      {messages.length === 0 && (
        <p className="text-center text-sm text-black/40 mt-10">
          아직 대화 내용이 없어요. 아래에서 메시지를 추가해보세요.
        </p>
      )}
      {flagged.map(({ message, showAvatarAndName, showTime }) => (
        <MessageBubble
          key={message.id}
          message={message}
          partnerName={partnerName}
          partnerAvatar={partnerAvatar}
          showAvatarAndName={showAvatarAndName}
          showTime={showTime}
          captureMode={captureMode}
          onEdit={() => setEditingMessage(message)}
          onDelete={() => handleDeleteMessage(message.id)}
        />
      ))}
    </div>
  );

  if (captureMode) {
    return (
      <div
        className="fixed inset-0 z-40 bg-white flex flex-col"
        onClick={handleCaptureTap}
      >
        <div ref={captureRef} className="flex flex-col flex-1 min-h-0">
          <StatusBar time={statusBarTime} />
          {header}
          {chatArea}
        </div>
        <div
          className={`absolute bottom-0 inset-x-0 flex items-center justify-center gap-3 p-4 transition-opacity duration-300 ${
            showExitBar ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExportPng();
            }}
            className="tap-feedback bg-black/70 text-white text-sm rounded-full px-4 py-2"
          >
            PNG로 저장
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              exitCaptureMode();
            }}
            className="tap-feedback bg-black/70 text-white text-sm rounded-full px-4 py-2"
          >
            캡처 모드 종료
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-screen-in flex-1 flex flex-col bg-white max-w-[480px] w-full mx-auto sm:border-x border-gray-200 min-h-screen">
      <StatusBar time={statusBarTime} />
      {header}
      {chatArea}

      <div className="shrink-0 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex rounded-full bg-gray-100 p-0.5 text-xs">
            <button
              onClick={() => setSender("PARTNER")}
              className={`tap-feedback px-2.5 py-1 rounded-full ${
                sender === "PARTNER" ? "bg-black text-white" : "text-gray-500"
              }`}
            >
              상대
            </button>
            <button
              onClick={() => setSender("ME")}
              className={`tap-feedback px-2.5 py-1 rounded-full ${
                sender === "ME" ? "bg-[#fee500] text-black" : "text-gray-500"
              }`}
            >
              나
            </button>
          </div>
          <input
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            className="w-[88px] text-xs border border-gray-200 rounded-full px-2 py-1.5 text-center focus:outline-none"
            aria-label="시간 표시"
          />
          <button
            onClick={handleAddDivider}
            className="tap-feedback text-xs text-gray-500 border border-gray-200 rounded-full px-2.5 py-1.5"
          >
            + 날짜
          </button>
        </div>
        <div className="flex items-end gap-2 px-3 pb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            aria-label="사진 추가"
            className="tap-feedback w-9 h-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-lg disabled:opacity-40"
          >
            🖼
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
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지 입력"
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

      {settingsOpen && (
        <RoomSettingsModal
          initialName={partnerName}
          initialAvatar={partnerAvatar}
          initialUnread={unreadCount}
          initialStatusBarTime={statusBarTime}
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

      {editingMessage && (
        <MessageEditModal
          type={editingMessage.type}
          initialContent={editingMessage.content}
          initialTimeLabel={editingMessage.timeLabel}
          initialSender={editingMessage.sender}
          onCancel={() => setEditingMessage(null)}
          onSave={(data) => {
            const id = editingMessage.id;
            setEditingMessage(null);
            startTransition(() => {
              updateMessage(id, profileId, roomId, data);
            });
          }}
        />
      )}
    </div>
  );
}
