import AvatarImage from "./AvatarImage";
import { IconCalendar, IconChevronRight } from "./icons";

export type UIMessage = {
  id: string;
  sender: "ME" | "PARTNER";
  type: "TEXT" | "IMAGE" | "DATE_DIVIDER";
  content: string;
  timeLabel: string;
};

export default function MessageBubble({
  message,
  partnerName,
  partnerAvatar,
  showAvatarAndName,
  showTime,
  captureMode,
  onEdit,
  onDelete,
}: {
  message: UIMessage;
  partnerName: string;
  partnerAvatar: string | null;
  showAvatarAndName: boolean;
  showTime: boolean;
  captureMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (message.type === "DATE_DIVIDER") {
    return (
      <div className="flex justify-center my-3 group relative animate-bubble-in">
        <span className="bg-white shadow-sm text-gray-700 text-[13px] font-medium pl-2.5 pr-2 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform duration-100">
          <IconCalendar className="w-3.5 h-3.5 text-gray-500" />
          {message.content}
          <IconChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </span>
        {!captureMode && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1">
            <IconButton label="수정" onClick={onEdit}>
              ✎
            </IconButton>
            <IconButton label="삭제" onClick={onDelete}>
              ✕
            </IconButton>
          </div>
        )}
      </div>
    );
  }

  const isMe = message.sender === "ME";

  const bubble =
    message.type === "IMAGE" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={message.content}
        alt=""
        className="max-w-[220px] max-h-[280px] rounded-[14px] object-cover"
      />
    ) : (
      <div
        className={`max-w-[240px] sm:max-w-[260px] px-3 py-2 rounded-[16px] text-[15px] leading-[1.35] whitespace-pre-wrap break-words ${
          isMe ? "bg-[#fee500] text-black" : "bg-white text-black shadow-sm"
        }`}
      >
        {message.content}
      </div>
    );

  const time = showTime ? (
    <span className="text-[11px] text-gray-400 shrink-0 mb-0.5">
      {message.timeLabel}
    </span>
  ) : null;

  const controls = !captureMode ? (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 shrink-0 self-end mb-0.5">
      <IconButton label="수정" onClick={onEdit}>
        ✎
      </IconButton>
      <IconButton label="삭제" onClick={onDelete}>
        ✕
      </IconButton>
    </div>
  ) : null;

  if (isMe) {
    return (
      <div className="flex items-end justify-end gap-1.5 group px-3 animate-bubble-in">
        {controls}
        {time}
        {bubble}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 group px-3 animate-bubble-in">
      {showAvatarAndName && (
        <span className="text-xs text-gray-500 ml-[44px]">
          {partnerName}
        </span>
      )}
      <div className="flex items-end gap-2">
        {showAvatarAndName ? (
          <AvatarImage src={partnerAvatar} alt={partnerName} size={36} />
        ) : (
          <div className="w-9 shrink-0" />
        )}
        {bubble}
        {time}
        {controls}
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="tap-feedback w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 text-[11px] flex items-center justify-center"
    >
      {children}
    </button>
  );
}
