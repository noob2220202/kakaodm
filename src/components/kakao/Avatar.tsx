import { useId } from "react";
import { SQUIRCLE_PATH } from "./units";
import { avatarColor } from "@/lib/kakaoSpec";

export default function KakaoAvatar({
  src,
  color,
  size,
}: {
  src: string | null;
  color: string;
  size: string;
}) {
  const id = useId().replace(/:/g, "");
  const c = avatarColor(color);
  return (
    <svg
      viewBox="0 0 1 1"
      style={{ width: size, height: size, display: "block", flexShrink: 0 }}
      aria-hidden
    >
      <defs>
        <clipPath id={`sq${id}`}>
          <path d={SQUIRCLE_PATH} />
        </clipPath>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.base} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#sq${id})`}>
        {src ? (
          <image
            href={src}
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <>
            <rect width="1" height="1" fill={`url(#g${id})`} />
            <circle cx="0.5" cy="0.375" r="0.118" fill={c.figure} />
            <path
              d="M0.27,0.695 C0.27,0.605 0.38,0.555 0.5,0.555 C0.62,0.555 0.73,0.605 0.73,0.695 Q0.73,0.725 0.7,0.725 L0.3,0.725 Q0.27,0.725 0.27,0.695 Z"
              fill={c.figure}
            />
          </>
        )}
      </g>
      <path
        d={SQUIRCLE_PATH}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="0.012"
      />
    </svg>
  );
}
