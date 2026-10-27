import type { Platform } from "@/lib/kakaoSpec";
import { u } from "./units";

const INK = "#14191D";

export function ChatHeader(props: {
  platform: Platform;
  title: string;
  onBack?: () => void;
}) {
  return props.platform === "ios" ? (
    <IOSHeader {...props} />
  ) : (
    <AndroidHeader {...props} />
  );
}

export function ChatInputBar({ platform }: { platform: Platform }) {
  return platform === "ios" ? <IOSInputBar /> : <AndroidInputBar />;
}

const IOS_INK = "#1B2733";

function IOSHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <>
      <svg
        viewBox="0 0 393 92"
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
          d="M27.4 60.4 L18.9 68.9 L27.4 77.4"
          stroke={IOS_INK}
          strokeWidth="2.1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="319.6"
          cy="68"
          r="7.3"
          stroke={IOS_INK}
          strokeWidth="1.95"
          fill="none"
        />
        <path
          d="M324.9 73.4 L329.9 78.5"
          stroke={IOS_INK}
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M352.4 62.2 H370.4 M352.4 68.55 H370.4 M352.4 74.9 H370.4"
          stroke={IOS_INK}
          strokeWidth="1.85"
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
            left: u(4),
            top: u(50),
            width: u(40),
            height: u(38),
            borderRadius: u(19),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: u(70),
          right: u(70),
          top: u(69.3 - 11),
          height: u(22),
          lineHeight: u(22),
          textAlign: "center",
          fontSize: u(16.9),
          fontWeight: 600,
          color: IOS_INK,
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

function IOSInputBar() {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: u(76.5),
        background: "#FFFFFF",
      }}
    >
      <svg
        viewBox="0 0 393 76.5"
        style={{ width: "100%", display: "block" }}
        aria-hidden
      >
        <circle cx="24.1" cy="23.2" r="14.2" fill="#F0F0F2" />
        <path
          d="M24.1 16.6 V29.8 M17.5 23.2 H30.7"
          stroke="#111"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect
          x="46.2"
          y="5.3"
          width="300.5"
          height="35.9"
          rx="17.95"
          fill="#F0F0F2"
        />
        <circle cx="326" cy="23.2" r="13" fill="#D9D8DC" />
        <circle cx="321.7" cy="20.3" r="1.25" fill="#1A1A1A" />
        <circle cx="330.3" cy="20.3" r="1.25" fill="#1A1A1A" />
        <path
          d="M321.2 25 Q326 29.6 330.8 25"
          stroke="#1A1A1A"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="369.2" cy="23.2" r="14.2" fill="#F0F0F2" />
        <path
          d="M366.2 16.9 L364.4 29.5 M373.6 16.9 L371.8 29.5 M362.6 20.7 H375.6 M361.8 25.7 H374.8"
          stroke="#111"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: u(58),
          top: u(5.3),
          height: u(35.9),
          lineHeight: u(35.9),
          fontSize: u(12.3),
          color: "#C3C2C7",
        }}
      >
        메시지 입력
      </div>
    </div>
  );
}

function AndroidHeader({
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
          fontSize: u(17.6),
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

function AndroidInputBar() {
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
          fontSize: u(14.7),
          color: "#9A9FA3",
        }}
      >
        메시지 입력
      </div>
    </div>
  );
}
