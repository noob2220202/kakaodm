"use client";

import { useState } from "react";

type Sender = "ME" | "PARTNER";

export default function MessageEditModal({
  type,
  initialContent,
  initialTimeLabel,
  initialSender,
  onSave,
  onCancel,
}: {
  type: "TEXT" | "IMAGE" | "DATE_DIVIDER";
  initialContent: string;
  initialTimeLabel: string;
  initialSender: Sender;
  onSave: (data: {
    content: string;
    timeLabel: string;
    sender: Sender;
  }) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [timeLabel, setTimeLabel] = useState(initialTimeLabel);
  const [sender, setSender] = useState<Sender>(initialSender);

  return (
    <div className="animate-modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="animate-modal-panel bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-center">
          {type === "DATE_DIVIDER" ? "날짜 구분선 수정" : "메시지 수정"}
        </h2>

        {type === "TEXT" && (
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#fee500]"
          />
        )}

        {type === "DATE_DIVIDER" && (
          <input
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500]"
          />
        )}

        {type === "IMAGE" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content}
            alt=""
            className="max-h-48 rounded-lg mx-auto object-contain"
          />
        )}

        {type !== "DATE_DIVIDER" && (
          <div className="flex gap-2">
            <button
              onClick={() => setSender("PARTNER")}
              className={`tap-feedback flex-1 rounded-lg py-2 text-sm font-medium ${
                sender === "PARTNER"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              상대가 보냄
            </button>
            <button
              onClick={() => setSender("ME")}
              className={`tap-feedback flex-1 rounded-lg py-2 text-sm font-medium ${
                sender === "ME"
                  ? "bg-[#fee500] text-black"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              내가 보냄
            </button>
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          시간 표시
          <input
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="오전 11:23"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fee500]"
          />
        </label>

        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={() => onSave({ content, timeLabel, sender })}
            className="tap-feedback bg-[#fee500] text-black font-semibold rounded-lg py-2.5"
          >
            저장
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
