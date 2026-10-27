"use client";

import { useId } from "react";
import { SPEC } from "@/lib/kakaoSpec";
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

// Measured from the chat-list screen of the reference recording (scaled to the 380dp screen).
const L = {
  titleCenterY: 78,
  iconCenterY: 78,
  chipsTop: 110,
  chipH: 38.8,
  chipPadX: 17,
  chipGap: 7,
  firstRowTop: 166,
  rowH: 69.3,
  avatar: 52.3,
  avatarLeft: 16.2,
  textLeft: 80.5,
  nameTop: 7.7,
  previewTop: 31.2,
  timeRight: 14.1,
  tabCenterY: 744,
  tabXs: [47.4, 120, 192.6, 264.6, 337.6],
};

const INK = "#111111";

// Kakao's settings icon is a soft six-lobed "flower" rather than a toothed gear.
const GEAR_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 72; i++) {
    const t = (2 * Math.PI * i) / 72;
    const r = 8.5 + 0.95 * Math.cos(6 * t + Math.PI);
    pts.push(`${(353.7 + r * Math.cos(t)).toFixed(2)} ${(78 + r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();
const TAB_GREY = "#B4B4B8";

export default function KakaoChatList({
  rows,
  statusBarTime,
  battery,
  onRowClick,
  onNewChat,
  onSettings,
}: {
  rows: KakaoListRow[];
  statusBarTime: string;
  battery: number;
  onRowClick?: (id: string) => void;
  onNewChat?: () => void;
  onSettings?: () => void;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div
      style={{ containerType: "inline-size", width: "100%", height: "100%" }}
    >
      <div
        className="kakao-screen"
        style={
          {
            "--u": `calc(100cqw / ${SPEC.W})`,
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
          time={statusBarTime}
          battery={battery}
          bg="#FFFFFF"
          id={id}
        />

        <div
          style={{
            position: "absolute",
            left: u(16.5),
            top: u(L.titleCenterY - 15),
            height: u(30),
            lineHeight: u(30),
            fontSize: u(23),
            fontWeight: 800,
          }}
        >
          채팅
        </div>

        <svg
          viewBox="0 0 380 100"
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
            <circle cx="263.4" cy="76.6" r="7.4" />
            <path d="M268.9 82.1 L273.8 87" />
            <path d="M315.9 79.7 A8.4 8.4 0 1 1 312.9 72.6" />
            <path d="M301.6 84.9 L299.3 89.2 L304.2 87.3" />
            <path d="M316.6 72.4 V79 M313.3 75.7 H319.9" />
            <path d={GEAR_PATH} />
            <circle cx="353.7" cy="78" r="3.1" />
          </g>
        </svg>
        {onNewChat && (
          <button
            aria-label="새 대화방"
            onClick={onNewChat}
            className="kakao-press"
            style={{
              position: "absolute",
              left: u(290),
              top: u(58),
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
              left: u(333),
              top: u(58),
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
            paddingLeft: u(15.6),
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
                fontSize: u(15),
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
            bottom: u(84),
            overflowY: "auto",
          }}
        >
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
                  top: u(L.nameTop - 3.6),
                  fontSize: u(16.3),
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
                  top: u(L.previewTop - 3.7),
                  fontSize: u(12.7),
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
                  top: u(5.6),
                  fontSize: u(11.7),
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
                    top: u(28),
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
          viewBox="0 0 380 84"
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
          <g transform="translate(0 -700)">
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
