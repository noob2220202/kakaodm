import { SPEC } from "@/lib/kakaoSpec";
import { u } from "./units";

const INK = "#14191D";

export function ChatHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <>
      <svg
        viewBox="0 0 380 84"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "block",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <path
          d="M22 61.75 H38.8 M29.6 53.4 L21.6 61.75 L29.6 70.1"
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="262"
          cy="60.1"
          r="7.6"
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M267.6 65.8 L272.4 70.6"
          stroke={INK}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          transform="rotate(-4 306.25 61.25) translate(294.85 49.85) scale(0.95)"
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          stroke={INK}
          strokeWidth="2.05"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M340.5 54 H358 M340.5 61.5 H358 M340.5 68.5 H358"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {onBack && (
        <button
          onClick={onBack}
          aria-label="뒤로"
          className="kakao-press"
          style={{
            position: "absolute",
            left: u(8),
            top: u(42),
            width: u(44),
            height: u(40),
            borderRadius: u(20),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: u(59.6),
          right: u(140),
          top: u(61.75 - 11),
          height: u(22),
          lineHeight: u(22),
          fontSize: u(SPEC.titleSize),
          fontWeight: 800,
          color: INK,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>
    </>
  );
}

export function ChatInputBar() {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: u(62),
      }}
    >
      <svg
        viewBox="0 0 380 62"
        style={{ width: "100%", display: "block" }}
        aria-hidden
      >
        <rect
          x="11"
          y="0"
          width="359"
          height="51.5"
          rx="25.75"
          fill="#EEF3F6"
        />
        <circle cx="36.75" cy="26.25" r="17" fill="#FFFFFF" />
        <path
          d="M36.75 19 V33.5 M29.5 26.25 H44"
          stroke="#151515"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <circle cx="301.75" cy="26.25" r="12.25" fill="#D1D5D8" />
        <circle cx="296.6" cy="23.2" r="1.25" fill="#1A1A1A" />
        <path
          d="M307.3 21.9 L305.1 23.4 L307.3 24.8"
          stroke="#1A1A1A"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M296.4 28.1 Q301.75 33.2 307.1 28.1"
          stroke="#1A1A1A"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="313.9" cy="14.6" r="2.6" fill="#F2652D" />
        <circle cx="344.25" cy="26.25" r="17" fill="#FFFFFF" />
        <path
          d="M341.6 19.4 L339.9 33.1 M348.6 19.4 L346.9 33.1 M337.6 23.5 H351 M336.9 29 H350.3"
          stroke="#151515"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: u(64.5),
          top: 0,
          height: u(51.5),
          lineHeight: u(51.5),
          fontSize: u(SPEC.placeholderSize),
          color: "#9A9FA3",
        }}
      >
        메시지 입력
      </div>
    </div>
  );
}
