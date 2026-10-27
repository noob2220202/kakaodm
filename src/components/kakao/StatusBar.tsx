function fan(r1: number, r2: number, deg: number): string {
  const a = (deg * Math.PI) / 180;
  const p = (r: number, s: number) =>
    `${(s * r * Math.sin(a)).toFixed(3)} ${(-r * Math.cos(a)).toFixed(3)}`;
  return `M${p(r1, -1)} L${p(r2, -1)} A${r2} ${r2} 0 0 1 ${p(r2, 1)} L${p(r1, 1)} A${r1} ${r1} 0 0 0 ${p(r1, -1)} Z`;
}

import type { Platform } from "@/lib/kakaoSpec";

export default function KakaoStatusBar(props: {
  platform: Platform;
  time: string;
  battery: number;
  bg: string;
  id: string;
}) {
  return props.platform === "ios" ? (
    <IOSStatusBar {...props} />
  ) : (
    <AndroidStatusBar {...props} />
  );
}

// Measured from the iPhone recording (393pt wide).
function IOSStatusBar({
  time,
  battery,
  id,
}: {
  time: string;
  battery: number;
  id: string;
}) {
  const level = Math.max(0, Math.min(100, Math.round(battery)));
  const bx = 341.3;
  const bw = 24;
  return (
    <svg
      viewBox="0 0 393 54"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        display: "block",
      }}
      aria-hidden
    >
      <text
        x="59.8"
        y="35.2"
        textAnchor="middle"
        fontSize="15.9"
        fontWeight="600"
        fill="#000"
        letterSpacing="0"
      >
        {time}
      </text>
      {[
        [296, 4],
        [300.8, 6.6],
        [305.6, 9],
        [310.4, 11.4],
      ].map(([x, h]) => (
        <rect
          key={x}
          x={x}
          y={34.6 - h}
          width="3.2"
          height={h}
          rx="0.9"
          fill="#000"
        />
      ))}
      <g fill="#000" transform="translate(327.75 34.7)">
        <path d={fan(0.001, 3.9, 42)} />
        <path d={fan(5.4, 7.7, 42)} />
        <path d={fan(9.1, 11.4, 42)} />
      </g>
      <defs>
        <clipPath id={`ibatt-${id}`}>
          <rect x={bx} y="22.6" width={bw} height="13" rx="4.1" />
        </clipPath>
      </defs>
      <g clipPath={`url(#ibatt-${id})`}>
        <rect x={bx} y="22.6" width={bw} height="13" fill="rgba(0,0,0,0.35)" />
        <rect
          x={bx}
          y="22.6"
          width={(bw * level) / 100}
          height="13"
          fill="#000"
        />
      </g>
      <path
        d="M366.2 27.2 a1.5 1.5 0 0 1 1.5 1.5 v1.6 a1.5 1.5 0 0 1 -1.5 1.5 z"
        fill="rgba(0,0,0,0.35)"
      />
      <text
        x={bx + bw / 2}
        y="33.1"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#fff"
        letterSpacing="0"
      >
        {level}
      </text>
    </svg>
  );
}

function AndroidStatusBar({
  time,
  battery,
  bg,
  id,
}: {
  time: string;
  battery: number;
  bg: string;
  id: string;
}) {
  const level = Math.max(0, Math.min(100, Math.round(battery)));
  const ink = "#2F363D";
  return (
    <svg
      viewBox="0 0 380 38"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        display: "block",
      }}
      aria-hidden
    >
      {time && (
        <text x="21" y="24" fontSize="13.2" fontWeight="500" fill={ink}>
          {time}
        </text>
      )}
      <path
        d="M288.1 15.9 h3.1 l5.1 -3.9 v13.6 l-5.1 -3.9 h-3.1 a0.9 0.9 0 0 1 -0.9 -0.9 v-4 a0.9 0.9 0 0 1 0.9 -0.9 z"
        fill={ink}
      />
      <path
        d="M287.4 13.2 L299.6 25.2"
        stroke={bg}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M287.4 13.2 L299.6 25.2"
        stroke={ink}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <g fill={ink} transform="translate(310.5 23.6)">
        <circle cx="0" cy="-1.3" r="1.35" />
        <path d={fan(3.6, 5.3, 44)} />
        <path d={fan(6.6, 8.3, 44)} />
        <path d={fan(9.6, 11.2, 44)} />
      </g>
      <text x="317.8" y="18" fontSize="6.9" fontWeight="700" fill={ink}>
        6
      </text>
      <path
        d="M314.2 20.4 v4.6 M312.8 23.7 l1.4 1.4 l1.4 -1.4 M319.8 25.2 v-4.6 M318.4 21.9 l1.4 -1.4 l1.4 1.4"
        stroke={ink}
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <clipPath id={`batt-${id}`}>
          <rect x="326.75" y="11.6" width="31.25" height="14.5" rx="7.25" />
        </clipPath>
      </defs>
      <g clipPath={`url(#batt-${id})`}>
        <rect x="326.75" y="11.6" width="31.25" height="14.5" fill="#7B8B98" />
        <rect
          x="326.75"
          y="11.6"
          width={(31.25 * level) / 100}
          height="14.5"
          fill="#35393F"
        />
      </g>
      <path
        d="M335.6 14.6 l-3.9 5.1 h2.9 l-1.2 4.4 l4.2 -5.6 h-2.9 l1.6 -3.9 z"
        fill="#fff"
      />
      <text
        x="345.3"
        y="23.1"
        textAnchor="middle"
        fontSize="11.4"
        fontWeight="700"
        fill="#fff"
        letterSpacing="-0.2"
      >
        {level}
      </text>
    </svg>
  );
}
