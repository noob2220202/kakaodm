"use client";

import { useState } from "react";
import type { KakaoMessage } from "./kakao/MessageList";

type Sender = "ME" | "PARTNER";
type Edit = {
  content: string;
  timeLabel: string;
  sender: Sender;
  unread: boolean;
};

const field =
  "border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500]";

export default function MessageEditModal({
  message,
  onSave,
  onDelete,
  onMove,
  onCancel,
}: {
  message: KakaoMessage;
  onSave: (data: Edit) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<Edit>({
    content: message.content,
    timeLabel: message.timeLabel,
    sender: message.sender,
    unread: message.unread,
  });
  const isDivider = message.type === "DATE_DIVIDER";

  return (
    <div className="animate-modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4">
      <div className="animate-modal-panel bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4 max-h-[92dvh] overflow-y-auto">
        <h2 className="text-lg font-bold text-center">
          {isDivider ? "날짜 구분선 수정" : "메시지 수정"}
        </h2>

        {message.type === "TEXT" && (
          <textarea
            autoFocus
            value={v.content}
            onChange={(e) => setV({ ...v, content: e.target.value })}
            rows={3}
            className={`${field} resize-none`}
          />
        )}
        {isDivider && (
          <input
            autoFocus
            value={v.content}
            onChange={(e) => setV({ ...v, content: e.target.value })}
            className={field}
          />
        )}
        {message.type === "IMAGE" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.content}
            alt=""
            className="max-h-48 rounded-lg mx-auto object-contain"
          />
        )}

        {!isDivider && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setV({ ...v, sender: "PARTNER" })}
                className={`tap-feedback flex-1 rounded-lg py-2 text-sm font-medium ${v.sender === "PARTNER" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
              >
                상대가 보냄
              </button>
              <button
                onClick={() => setV({ ...v, sender: "ME" })}
                className={`tap-feedback flex-1 rounded-lg py-2 text-sm font-medium ${v.sender === "ME" ? "bg-[#fee500] text-black" : "bg-gray-100 text-gray-600"}`}
              >
                내가 보냄
              </button>
            </div>
            <div className="flex gap-3 items-end">
              <label className="flex flex-col gap-1 text-sm text-gray-600 flex-1">
                시간
                <input
                  value={v.timeLabel}
                  onChange={(e) => setV({ ...v, timeLabel: e.target.value })}
                  placeholder="오후 4:39"
                  className={field}
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 pb-2.5">
                <input
                  type="checkbox"
                  checked={v.unread}
                  onChange={(e) => setV({ ...v, unread: e.target.checked })}
                  className="w-4 h-4 accent-[#f2c200]"
                />
                안읽음 1
              </label>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onMove("up")}
            className="tap-feedback flex-1 text-sm border border-gray-300 rounded-lg py-2"
          >
            ▲ 위로
          </button>
          <button
            onClick={() => onMove("down")}
            className="tap-feedback flex-1 text-sm border border-gray-300 rounded-lg py-2"
          >
            ▼ 아래로
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onSave(v)}
            className="tap-feedback bg-[#fee500] text-black font-semibold rounded-lg py-2.5"
          >
            저장
          </button>
          <button
            onClick={onDelete}
            className="tap-feedback text-red-500 text-sm py-1"
          >
            삭제
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
