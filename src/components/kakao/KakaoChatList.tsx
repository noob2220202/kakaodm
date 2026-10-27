"use client";

import { useId } from "react";
import type { Platform } from "@/lib/kakaoSpec";
import KakaoAvatar from "./Avatar";
import KakaoStatusBar from "./StatusBar";
import { u } from "./units";

export type KakaoListRow = {
  id: string;
  name: string;
  avatar: string | null;
  avatarColor: string;
  preview: string;
  time: string;
  unread: number;
};

// Measured from the chat-list screen of the iPhone recording; the Android layout is the same
// design scaled to the 380dp screen.
type ListLayout = {
  W: number;
  H: number;
  titleLeft: number;
  titleCenterY: number;
  titleSize: number;
  iconY: number;
  iconXs: [number, number, number];
  iconScale: number;
  chipsTop: number;
  chipsLeft: number;
  chipH: number;
  chipPadX: number;
  chipGap: number;
  chipFont: number;
  firstRowTop: number;
  rowH: number;
  avatar: number;
  avatarLeft: number;
  textLeft: number;
  nameTop: number;
  nameSize: number;
  previewTop: number;
  previewSize: number;
  timeTop: number;
  timeSize: number;
  timeRight: number;
  badgeTop: number;
  tabBarH: number;
  tabY: number;
  tabXs: number[];
};

const LAYOUTS: Record<Platform, ListLayout> = {
  android: {
    W: 380,
    H: 784,
    titleLeft: 16.5,
    titleCenterY: 78,
    titleSize: 23,
    iconY: 78,
    iconXs: [264.6, 307.5, 353.7],
    iconScale: 1,
    chipsTop: 110,
    chipsLeft: 15.6,
    chipH: 38.8,
    chipPadX: 17,
    chipGap: 7,
    chipFont: 15,
    firstRowTop: 166,
    rowH: 69.3,
    avatar: 52.3,
    avatarLeft: 16.2,
    textLeft: 80.5,
    nameTop: 4.1,
    nameSize: 16.3,
    previewTop: 27.5,
    previewSize: 12.7,
    timeTop: 5.6,
    timeSize: 11.7,
    timeRight: 14.1,
    badgeTop: 28,
    tabBarH: 84,
    tabY: 744,
    tabXs: [47.4, 120, 192.6, 264.6, 337.6],
  },
  ios: {
    W: 393,
    H: 852,
    titleLeft: 16,
    titleCenterY: 86.9,
    titleSize: 21.8,
    iconY: 87,
    iconXs: [282.2, 324, 365.2],
    iconScale: 0.96,
    chipsTop: 117.8,
    chipsLeft: 15,
    chipH: 37.3,
    chipPadX: 16.3,
    chipGap: 6.7,
    chipFont: 14.8,
    firstRowTop: 171.7,
    rowH: 66.6,
    avatar: 50.3,
    avatarLeft: 15.6,
    textLeft: 77.5,
    nameTop: 3.9,
    nameSize: 15.6,
    previewTop: 26.4,
    previewSize: 12.1,
    timeTop: 5.4,
    timeSize: 11.2,
    timeRight: 13.6,
    badgeTop: 27,
    tabBarH: 83,
    tabY: 804.5,
    tabXs: [49, 124.1, 199.2, 273.6, 349.2],
  },
};

const INK = "#111111";

// The display ad Kakao pins above the chat rows, copied from a real capture.
// Sizes are dp at the Android list scale and follow the avatar size on iPhone.
function AdBanner({ L }: { L: ListLayout }) {
  const k = L.avatar / 52.3;
  const gap = L.firstRowTop - L.chipsTop - L.chipH;
  return (
    <div
      style={{
        position: "relative",
        height: u(88 * k),
        margin: `0 ${u(L.chipsLeft)} ${u(gap)}`,
        borderRadius: u(12 * k),
        background: "#F3F3F3",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: u(13.5 * k),
          right: u(112 * k),
          top: u(26.5 * k),
          fontSize: u(14 * k),
          lineHeight: u(18 * k),
          fontWeight: 700,
          color: "#4B4B4B",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        노출형 에어 줌 쿠셔닝으로
      </div>
      <div
        style={{
          position: "absolute",
          left: u(13.5 * k),
          right: u(112 * k),
          top: u(45.5 * k),
          fontSize: u(10.3 * k),
          lineHeight: u(14 * k),
          color: "#767676",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        더욱 강력하고 민첩하게.
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kakao/ad-banner.jpg"
        alt=""
        style={{
          position: "absolute",
          right: u(12.85 * k),
          top: u(17.85 * k),
          width: u(85.8 * k),
          height: u(51.5 * k),
          borderRadius: u(3 * k),
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: u(7 * k),
          top: u(8 * k),
          width: u(17 * k),
          height: u(17 * k),
          lineHeight: u(17 * k),
          borderRadius: "50%",
          background: "#FFFFFF",
          color: "#6E6E6E",
          fontSize: u(9.5 * k),
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        AD
      </div>
    </div>
  );
}

// Kakao's settings icon is a soft six-lobed "flower" rather than a toothed gear.
const GEAR_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 72; i++) {
    const t = (2 * Math.PI * i) / 72;
    const r = 8.5 + 0.95 * Math.cos(6 * t + Math.PI);
    pts.push(`${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();
const TAB_GREY = "#B4B4B8";

export default function KakaoChatList({
  platform,
  rows,
  statusBarTime,
  battery,
  onRowClick,
  onNewChat,
  onSettings,
}: {
  platform: Platform;
  rows: KakaoListRow[];
  statusBarTime: string;
  battery: number;
  onRowClick?: (id: string) => void;
  onNewChat?: () => void;
  onSettings?: () => void;
}) {
  const id = useId().replace(/:/g, "");
  const L = LAYOUTS[platform];
  const [sx, nx, gx] = L.iconXs;
  const k = L.iconScale;
  return (
    <div
      style={{ containerType: "inline-size", width: "100%", height: "100%" }}
    >
      <div
        className="kakao-screen"
        style={
          {
            "--u": `calc(100cqw / ${L.W})`,
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            background: "#FFFFFF",
            fontFamily: "var(--font-kakao)",
            WebkitFontSmoothing: "antialiased",
            color: INK,
          } as React.CSSProperties
        }
      >
        <KakaoStatusBar
          platform={platform}
          time={statusBarTime}
          battery={battery}
          bg="#FFFFFF"
          id={id}
        />

        <div
          style={{
            position: "absolute",
            left: u(L.titleLeft),
            top: u(L.titleCenterY - 15),
            height: u(30),
            lineHeight: u(30),
            fontSize: u(L.titleSize),
            fontWeight: 800,
          }}
        >
          채팅
        </div>

        <svg
          viewBox={`0 0 ${L.W} 110`}
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
          <g
            stroke={INK}
            strokeWidth="2.1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g transform={`translate(${sx} ${L.iconY}) scale(${k})`}>
              <circle cx="-1.2" cy="-1.4" r="7.4" />
              <path d="M4.3 4.1 L9.2 9" />
            </g>
            <g transform={`translate(${nx} ${L.iconY}) scale(${k})`}>
              <path d="M8.4 0.7 A8.4 8.4 0 1 1 5.4 -6.4" />
              <path d="M-5.9 5.9 L-8.2 10.2 L-3.3 8.3" />
              <path d="M9.1 -6.6 V0 M5.8 -3.3 H12.4" />
            </g>
            <g transform={`translate(${gx} ${L.iconY}) scale(${k})`}>
              <path d={GEAR_PATH} />
              <circle cx="0" cy="0" r="3.1" />
            </g>
          </g>
        </svg>
        {onNewChat && (
          <button
            aria-label="새 대화방"
            onClick={onNewChat}
            className="kakao-press"
            style={{
              position: "absolute",
              left: u(nx - 19),
              top: u(L.iconY - 19),
              width: u(38),
              height: u(38),
              borderRadius: u(19),
            }}
          />
        )}
        {onSettings && (
          <button
            aria-label="프로필 전환"
            onClick={onSettings}
            className="kakao-press"
            style={{
              position: "absolute",
              left: u(gx - 19),
              top: u(L.iconY - 19),
              width: u(38),
              height: u(38),
              borderRadius: u(19),
            }}
          />
        )}

        <div
          className="no-scrollbar"
          style={{
            position: "absolute",
            top: u(L.chipsTop),
            left: 0,
            right: 0,
            display: "flex",
            gap: u(L.chipGap),
            paddingLeft: u(L.chipsLeft),
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {["전체", "안읽음", "ChatGPT", "통화"].map((label, i) => (
            <div
              key={label}
              style={{
                height: u(L.chipH),
                lineHeight: u(L.chipH),
                padding: `0 ${u(L.chipPadX)}`,
                borderRadius: u(L.chipH / 2),
                background: i === 0 ? "#171717" : "#EFEFEF",
                color: i === 0 ? "#FFFFFF" : "#222222",
                fontSize: u(L.chipFont),
                fontWeight: i === 0 ? 700 : 500,
                flexShrink: 0,
              }}
            >
              {label}
            </div>
          ))}
          <div
            style={{
              width: u(L.chipH),
              height: u(L.chipH),
              borderRadius: "50%",
              background: "#EFEFEF",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <svg
              viewBox="0 0 39 39"
              style={{ width: "100%", height: "100%", display: "block" }}
              aria-hidden
            >
              <path
                d="M11.5 14.5 H22 M11.5 19.5 H19 M11.5 24.5 H17.5 M24.5 20 V28 M20.5 24 H28.5"
                stroke="#333"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="27.8" cy="12.6" r="2" fill="#F2522E" />
            </svg>
          </div>
        </div>

        <div
          className="no-scrollbar"
          style={{
            position: "absolute",
            top: u(L.firstRowTop),
            left: 0,
            right: 0,
            bottom: u(L.tabBarH),
            overflowY: "auto",
          }}
        >
          <AdBanner L={L} />
          {rows.map((r) => (
            <div
              key={r.id}
              onClick={onRowClick ? () => onRowClick(r.id) : undefined}
              className={onRowClick ? "kakao-row" : undefined}
              style={{ position: "relative", height: u(L.rowH) }}
            >
              <div
                style={{ position: "absolute", left: u(L.avatarLeft), top: 0 }}
              >
                <KakaoAvatar
                  src={r.avatar}
                  color={r.avatarColor}
                  size={u(L.avatar)}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: u(L.textLeft),
                  right: u(90),
                  top: u(L.nameTop),
                  fontSize: u(L.nameSize),
                  lineHeight: u(22),
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.name}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: u(L.textLeft),
                  right: u(52),
                  top: u(L.previewTop),
                  fontSize: u(L.previewSize),
                  lineHeight: u(18),
                  color: "#8E8E93",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.preview}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: u(L.timeRight),
                  top: u(L.timeTop),
                  fontSize: u(L.timeSize),
                  lineHeight: u(18),
                  color: "#A3A3A8",
                  whiteSpace: "nowrap",
                }}
              >
                {r.time}
              </div>
              {r.unread > 0 && (
                <div
                  style={{
                    position: "absolute",
                    right: u(L.timeRight),
                    top: u(L.badgeTop),
                    minWidth: u(19),
                    height: u(19),
                    padding: `0 ${u(5.5)}`,
                    borderRadius: u(9.5),
                    background: "#FB4F3A",
                    color: "#fff",
                    fontSize: u(11.5),
                    fontWeight: 700,
                    lineHeight: u(19),
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {r.unread > 999 ? "999+" : r.unread}
                </div>
              )}
            </div>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${L.W} ${L.tabBarH}`}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "block",
            background: "#fff",
          }}
          aria-hidden
        >
          <g transform={`translate(0 ${-(L.H - L.tabBarH) + (L.tabY - 744)})`}>
            <g fill={TAB_GREY}>
              <circle cx={L.tabXs[0]} cy="737.3" r="5.6" />
              <path
                d={`M${L.tabXs[0] - 9.8} 754.6 c0 -6.2 4.4 -9.6 9.8 -9.6 s9.8 3.4 9.8 9.6 a1.4 1.4 0 0 1 -1.4 1.4 h-16.8 a1.4 1.4 0 0 1 -1.4 -1.4 z`}
              />
            </g>
            <path
              d={`M${L.tabXs[1]} 733.2 c6.6 0 11.6 4.4 11.6 10.3 s-5 10.3 -11.6 10.3 c-0.9 0 -1.8 -0.1 -2.6 -0.2 l-4.6 3.2 c-0.6 0.4 -1.3 -0.1 -1.2 -0.8 l0.8 -4.2 c-3.6 -1.8 -5.9 -4.8 -5.9 -8.3 c0 -5.9 5 -10.3 11.6 -10.3 z`}
              fill="#1E1E1E"
            />
            <g fill={TAB_GREY}>
              <path
                d={`M${L.tabXs[2] + 2.5} 734 c5.2 0 9.4 3.5 9.4 8.3 c0 2.7 -1.4 5 -3.6 6.5 l0.6 3.5 l-3.6 -2.3 c-0.9 0.2 -1.8 0.3 -2.8 0.3 c-5.2 0 -9.4 -3.5 -9.4 -8 s4.2 -8.3 9.4 -8.3 z`}
                opacity="0.7"
              />
              <path
                d={`M${L.tabXs[2] - 2.6} 738.6 c5.4 0 9.6 3.6 9.6 8.2 s-4.2 8.2 -9.6 8.2 c-1 0 -2 -0.1 -2.9 -0.4 l-3.9 2.5 l0.7 -3.8 c-2.2 -1.5 -3.5 -3.9 -3.5 -6.5 c0 -4.6 4.2 -8.2 9.6 -8.2 z`}
              />
            </g>
            <path
              d={`M${L.tabXs[2] - 4.4} 743.4 v6.6 l5.6 -3.3 z`}
              fill="#fff"
            />
            <g fill={TAB_GREY}>
              <path
                d={`M${L.tabXs[3] - 9.2} 741 h18.4 a1.4 1.4 0 0 1 1.4 1.5 l-1 12 a2 2 0 0 1 -2 1.8 h-15.2 a2 2 0 0 1 -2 -1.8 l-1 -12 a1.4 1.4 0 0 1 1.4 -1.5 z`}
              />
            </g>
            <path
              d={`M${L.tabXs[3] - 4.6} 742 v-2.6 a4.6 4.6 0 0 1 9.2 0 v2.6`}
              stroke={TAB_GREY}
              strokeWidth="2"
              fill="none"
            />
            <g fill={TAB_GREY}>
              <circle cx={L.tabXs[4] - 7.6} cy="744.6" r="2.3" />
              <circle cx={L.tabXs[4]} cy="744.6" r="2.3" />
              <circle cx={L.tabXs[4] + 7.6} cy="744.6" r="2.3" />
            </g>
            <circle cx={L.tabXs[4] + 13.3} cy="733" r="2.6" fill="#F2652D" />
          </g>
        </svg>
      </div>
    </div>
  );
}
