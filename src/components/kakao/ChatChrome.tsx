import { useId } from "react";
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

const IOS_INK = "#191919";

// iOS 26 "Liquid Glass" control: translucent white fill, bright rim, soft shadow.
function Glass({
  id,
  shape,
}: {
  id: string;
  shape: React.ReactElement<React.SVGProps<SVGElement>>;
}) {
  return (
    <>
      <defs>
        <linearGradient id={`gf-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.27" />
        </linearGradient>
        <filter id={`gs-${id}`} x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        {/* the shadow only shows outside the control, never through its glass */}
        <mask id={`gm-${id}`}>
          <rect x="0" y="0" width="393" height="120" fill="#fff" />
          <g fill="#000">{shape}</g>
        </mask>
      </defs>
      <g mask={`url(#gm-${id})`}>
        <g filter={`url(#gs-${id})`} opacity="0.12" transform="translate(0 1)">
          {shape}
        </g>
      </g>
      <g
        fill={`url(#gf-${id})`}
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="0.5"
      >
        {shape}
      </g>
    </>
  );
}

function IOSHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const id = useId().replace(/:/g, "");
  // a group room's member count ("대학교 친구들 3") is drawn in grey
  const count = /^(.*\S)\s+(\d+)$/.exec(title);
  return (
    <>
      <svg
        viewBox="0 0 393 100"
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
        <Glass
          id={`b${id}`}
          shape={<circle cx="37.72" cy="74.8" r="22.38" />}
        />
        <Glass
          id={`c${id}`}
          shape={
            <rect x="289" y="52.43" width="88.66" height="44.76" rx="22.38" />
          }
        />
        <path
          d="M41 65.9 L32.2 74.8 L41 83.7"
          stroke={IOS_INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="311.9"
          cy="73.6"
          r="7"
          stroke={IOS_INK}
          strokeWidth="2.05"
          fill="none"
        />
        <path
          d="M317 78.7 L321.6 83.3"
          stroke={IOS_INK}
          strokeWidth="2.15"
          strokeLinecap="round"
        />
        <path
          d="M344.9 67.78 H361.8 M344.9 74.8 H361.8 M344.9 81.84 H361.8"
          stroke={IOS_INK}
          strokeWidth="1.9"
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
            left: u(15.3),
            top: u(52.4),
            width: u(44.8),
            height: u(44.8),
            borderRadius: "50%",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: u(70),
          right: u(110),
          marginLeft: u(0),
          top: u(74.6 - 11),
          height: u(22),
          lineHeight: u(22),
          textAlign: "center",
          fontSize: u(17.9),
          fontWeight: 700,
          letterSpacing: 0,
          color: IOS_INK,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingLeft: u(40),
        }}
      >
        {count ? (
          <>
            {count[1]} <span style={{ color: "#363B3E" }}>{count[2]}</span>
          </>
        ) : (
          title
        )}
      </div>
    </>
  );
}

function IOSInputBar() {
  const id = useId().replace(/:/g, "");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: u(99.25),
      }}
    >
      <svg
        viewBox="0 0 393 99.25"
        style={{ width: "100%", display: "block", overflow: "visible" }}
        aria-hidden
      >
        <defs>
          <filter id={`is-${id}`} x="-10%" y="-60%" width="120%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect
          x="9.38"
          y="0"
          width="373.82"
          height="48.59"
          rx="24.3"
          fill="#000"
          opacity="0.12"
          filter={`url(#is-${id})`}
        />
        <rect
          x="9.38"
          y="0"
          width="373.82"
          height="48.59"
          rx="24.3"
          fill="#D8E7EF"
        />
        <circle cx="33.67" cy="24.3" r="16" fill="#FFFFFF" />
        <path
          d="M33.67 17.5 V31.1 M26.87 24.3 H40.47"
          stroke={IOS_INK}
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle cx="318.8" cy="24.1" r="11.5" fill="#BFCBD3" />
        <path
          d="M314 20.2 V22.6 M323.7 20.2 V22.6"
          stroke={IOS_INK}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M319.4 20.6 Q317.6 21.8 319 23.6"
          stroke={IOS_INK}
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M314.4 26.1 Q319.2 31 324.1 26.1"
          stroke={IOS_INK}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="359.1" cy="24.35" r="16" fill="#FFFFFF" />
        <path
          d="M356.4 17.9 L354.8 30.7 M363.4 17.9 L361.8 30.7 M352.6 21.8 H365.5 M351.9 27 H364.8"
          stroke={IOS_INK}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: u(58.3),
          top: 0,
          height: u(48.59),
          lineHeight: u(48.59),
          fontSize: u(14.4),
          color: "#8C9599",
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
