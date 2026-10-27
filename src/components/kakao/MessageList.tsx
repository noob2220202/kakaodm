"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Spec } from "@/lib/kakaoSpec";
import KakaoAvatar from "./Avatar";
import { u } from "./units";

export type KakaoMessage = {
  id: string;
  sender: "ME" | "PARTNER";
  type: "TEXT" | "IMAGE" | "DATE_DIVIDER";
  content: string;
  timeLabel: string;
  unread: boolean;
};

type Item = {
  m: KakaoMessage;
  first: boolean;
  last: boolean;
  /** a text bubble right after a photo gets its tail back, as in the app */
  tail: boolean;
  marginTop: number;
};

function sameGroup(a: KakaoMessage | undefined, b: KakaoMessage | undefined) {
  return (
    !!a &&
    !!b &&
    a.type !== "DATE_DIVIDER" &&
    b.type !== "DATE_DIVIDER" &&
    a.sender === b.sender &&
    a.timeLabel === b.timeLabel
  );
}

function layoutItems(messages: KakaoMessage[], spec: Spec): Item[] {
  return messages.map((m, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    let marginTop = 0;
    if (prev) {
      if (m.type === "DATE_DIVIDER" || prev.type === "DATE_DIVIDER")
        marginTop = spec.gap.date;
      else if (sameGroup(prev, m)) marginTop = spec.gap.consecutive;
      else
        marginTop =
          spec.gap.group +
          (m.sender === "PARTNER" ? (spec.gap.partnerExtra ?? 0) : 0);
    }
    const first = !sameGroup(prev, m);
    return {
      m,
      first,
      tail: first || prev?.type === "IMAGE",
      last: !sameGroup(m, next),
      marginTop,
    };
  });
}

export default function MessageList({
  spec,
  messages,
  partnerName,
  partnerAvatar,
  avatarColor,
  fontScale,
  onMessageClick,
}: {
  spec: Spec;
  messages: KakaoMessage[];
  partnerName: string;
  partnerAvatar: string | null;
  avatarColor: string;
  fontScale: number;
  onMessageClick?: (m: KakaoMessage) => void;
}) {
  const items = layoutItems(messages, spec);
  return (
    <>
      {items.map((it) => (
        <div
          key={it.m.id}
          onClick={onMessageClick ? () => onMessageClick(it.m) : undefined}
          className={onMessageClick ? "kakao-edit-target" : undefined}
          style={{ marginTop: u(it.marginTop), position: "relative" }}
        >
          {it.m.type === "DATE_DIVIDER" ? (
            <DatePill spec={spec} label={it.m.content} />
          ) : (
            <MessageRow
              spec={spec}
              item={it}
              partnerName={partnerName}
              partnerAvatar={partnerAvatar}
              avatarColor={avatarColor}
              fontScale={fontScale}
            />
          )}
        </div>
      ))}
    </>
  );
}

function DatePill({ spec, label }: { spec: Spec; label: string }) {
  const p = spec.datePill;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          height: u(p.h),
          borderRadius: u(p.h / 2),
          background: p.bg,
          paddingLeft: u(p.padL),
          paddingRight: u(p.padR),
          display: "flex",
          alignItems: "center",
          color: p.color,
          fontSize: u(p.fontSize),
          whiteSpace: "nowrap",
        }}
      >
        {p.icon && (
          <svg
            viewBox="0 0 12 12"
            style={{
              width: u(11.6),
              height: u(11.6),
              marginRight: u(4),
              flexShrink: 0,
            }}
            aria-hidden
          >
            <rect
              x="1"
              y="1.6"
              width="10"
              height="9.6"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.05"
            />
            <path d="M1 4.3 H11" stroke="currentColor" strokeWidth="1.05" />
            <g fill="currentColor">
              <circle cx="3.6" cy="6.6" r="0.62" />
              <circle cx="6" cy="6.6" r="0.62" />
              <circle cx="8.4" cy="6.6" r="0.62" />
              <circle cx="3.6" cy="8.9" r="0.62" />
              <circle cx="6" cy="8.9" r="0.62" />
            </g>
          </svg>
        )}
        <span style={{ lineHeight: 1 }}>{label}</span>
        <svg
          viewBox="0 0 6 10"
          style={{
            width: u(p.chevronW),
            height: u(p.chevronH),
            marginLeft: u(p.chevronGap),
            flexShrink: 0,
          }}
          aria-hidden
        >
          <path
            d="M0.9 0.9 L5.1 5 L0.9 9.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// A wrapped paragraph keeps its box at max-width in CSS; Kakao shrinks the bubble to the
// longest line, so measure the laid-out lines and narrow the box to them.
function useShrinkToLines(
  ref: React.RefObject<HTMLDivElement | null>,
  fitKey: string,
) {
  useLayoutEffect(() => {
    const box = ref.current;
    const text = box?.querySelector("[data-text]");
    if (!box || !text) return;
    const fit = () => {
      box.style.width = "";
      if (!box.offsetWidth) return;
      // union of the words' boxes: a space where a line wraps hangs past the line and must not count
      let left = Infinity;
      let right = -Infinity;
      const range = document.createRange();
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        for (const word of (n.textContent ?? "").matchAll(/\S+/g)) {
          range.setStart(n, word.index);
          range.setEnd(n, word.index + word[0].length);
          for (const r of range.getClientRects()) {
            left = Math.min(left, r.left);
            right = Math.max(right, r.right);
          }
        }
      }
      if (right < left) return;
      const scale = box.getBoundingClientRect().width / box.offsetWidth;
      const lines = (right - left) / scale;
      const cs = getComputedStyle(box);
      const w =
        lines + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 0.5;
      if (w < box.offsetWidth - 0.5) box.style.width = `${w}px`;
    };
    fit();
    const screen = box.closest(".kakao-screen");
    const ro = new ResizeObserver(fit);
    if (screen) ro.observe(screen);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [ref, fitKey]);
}

function PlainBubble({
  style,
  fitKey,
  children,
}: {
  style: React.CSSProperties;
  fitKey: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useShrinkToLines(ref, fitKey);
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

function bubblePath(w: number, h: number, spec: Spec, side: "left" | "right") {
  const R = spec.bubble.radius;
  const t = spec.bubble.tail;
  const jx = R - Math.sqrt(R * R - (R - t.joinY) * (R - t.joinY));
  const f = (n: number) => n.toFixed(3);
  // x mirrored for the right-hand (my) bubble; arc sweep flips with it
  const X = (x: number) => f(side === "left" ? x : w - x);
  const sw = side === "left" ? 1 : 0;
  return [
    `M${X(R)} 0 H${X(w - R)}`,
    `A${R} ${R} 0 0 ${sw} ${X(w)} ${f(R)} V${f(h - R)}`,
    `A${R} ${R} 0 0 ${sw} ${X(w - R)} ${f(h)} H${X(R)}`,
    `A${R} ${R} 0 0 ${sw} ${X(0)} ${f(h - R)} V${f(t.back)}`,
    `Q${X(t.lowCtrlX)} ${f(t.lowCtrlY)} ${X(-t.tipX)} ${f(t.tipY)}`,
    `Q${X(t.upCtrlX)} ${f(t.upCtrlY)} ${X(jx)} ${f(t.joinY)}`,
    `A${R} ${R} 0 0 ${sw} ${X(R)} 0 Z`,
  ].join(" ");
}

// Body and tail are drawn as one path so the tail never shows a seam against the box edge.
function TailedBubble({
  spec,
  color,
  side,
  style,
  fitKey,
  children,
}: {
  spec: Spec;
  color: string;
  side: "left" | "right";
  style: React.CSSProperties;
  fitKey: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useShrinkToLines(ref, fitKey);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const screen = el.closest(".kakao-screen") as HTMLElement | null;
      const unit = (screen?.clientWidth ?? spec.W) / spec.W;
      setBox({ w: el.offsetWidth / unit, h: el.offsetHeight / unit });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [spec.W]);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        background: box ? "transparent" : color,
        borderRadius: u(spec.bubble.radius),
      }}
    >
      {box && (
        <svg
          viewBox={`0 0 ${box.w} ${box.h}`}
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            display: "block",
          }}
          aria-hidden
        >
          <path d={bubblePath(box.w, box.h, spec, side)} fill={color} />
        </svg>
      )}
      {children}
    </div>
  );
}

function Meta({
  spec,
  m,
  show,
  align,
}: {
  spec: Spec;
  m: KakaoMessage;
  show: boolean;
  align: "left" | "right";
}) {
  if (!show && !m.unread) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "flex-end",
        alignSelf: "flex-end",
        flexShrink: 0,
        marginBottom: u(
          align === "left"
            ? (spec.time.bottomPartner ?? spec.time.bottom)
            : spec.time.bottom,
        ),
        [align === "left" ? "marginLeft" : "marginRight"]: u(spec.time.gap),
      }}
    >
      {m.unread && (
        <span
          style={{
            color: spec.unread.color,
            fontSize: u(spec.unread.size),
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          1
        </span>
      )}
      {show && (
        <span
          style={{
            color: spec.time.color,
            fontSize: u(spec.time.size),
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            letterSpacing: 0,
          }}
        >
          {m.timeLabel}
        </span>
      )}
    </div>
  );
}

// Kakao sizes photos by aspect ratio rather than fitting a fixed box
// (measured: 4:3 -> 275pt wide, 3:4 -> 240pt, 9:19.5 screenshot -> 231pt).
function imageSize(spec: Spec, w: number, h: number) {
  const a = w / h;
  let width: number;
  if (a >= 1) width = 275;
  else if (a >= 0.75) width = 240 + ((a - 0.75) / 0.25) * 35;
  else width = Math.max(200, 231 + ((a - 0.46) / 0.29) * 9);
  const k = spec.image.scale;
  return { w: width * k, h: Math.min(width / a, spec.image.maxH / k) * k };
}

function ImageBody({ spec, src }: { spec: Spec; src: string }) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const ref = useRef<HTMLImageElement>(null);
  const size = imageSize(spec, natural?.w ?? 4, natural?.h ?? 3);
  const measure = (img: HTMLImageElement) => {
    if (img.naturalWidth && img.naturalHeight)
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
  };
  // a server-rendered image can finish loading before React attaches onLoad
  useLayoutEffect(() => {
    if (ref.current?.complete) measure(ref.current);
  }, [src]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      onLoad={(e) => measure(e.currentTarget)}
      style={{
        width: u(size.w),
        height: u(size.h),
        objectFit: "cover",
        borderRadius: u(spec.image.radius),
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

function ShareButton({ spec }: { spec: Spec }) {
  const d = spec.image.shareD;
  return (
    <div
      style={{
        width: u(d),
        height: u(d),
        borderRadius: "50%",
        background: spec.image.shareBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 14 14"
        style={{ width: u(d * 0.47), height: u(d * 0.47) }}
        aria-hidden
      >
        <path
          d="M7 1.2 V8.6 M4.2 3.9 L7 1.1 L9.8 3.9"
          stroke={spec.image.shareFg}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 7.4 V12.4 H12 V7.4"
          stroke={spec.image.shareFg}
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function MessageRow({
  spec,
  item,
  partnerName,
  partnerAvatar,
  avatarColor,
  fontScale,
}: {
  spec: Spec;
  item: Item;
  partnerName: string;
  partnerAvatar: string | null;
  avatarColor: string;
  fontScale: number;
}) {
  const { m, first, last, tail } = item;
  const isMe = m.sender === "ME";
  const b = spec.bubble;
  const color = isMe ? "#FEE500" : "#FFFFFF";
  const isImage = m.type === "IMAGE";

  const [padL, padR] = (isMe ? b.pad?.me : b.pad?.partner) ?? [
    b.padH,
    b.padR ?? b.padH,
  ];
  const textStyle: React.CSSProperties = {
    position: "relative",
    padding: `${u(b.padTop)} ${u(padR)} ${u(b.padBottom)} ${u(padL)}`,
    maxWidth: u(b.maxWidth),
    minWidth: u(b.minWidth),
    boxSizing: "border-box",
    color: spec.textColor,
    fontSize: u(b.fontSize * fontScale),
    lineHeight: u(b.lineHeight * fontScale),
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    overflowWrap: "anywhere",
    textAlign: "left",
  };
  const text = (
    <span data-text style={{ position: "relative" }}>
      {m.content}
    </span>
  );
  const fitKey = `${m.content}|${fontScale}`;
  const body = isImage ? (
    <ImageBody spec={spec} src={m.content} />
  ) : tail ? (
    <TailedBubble
      spec={spec}
      color={color}
      side={isMe ? "right" : "left"}
      style={textStyle}
      fitKey={fitKey}
    >
      {text}
    </TailedBubble>
  ) : (
    <PlainBubble
      style={{ ...textStyle, background: color, borderRadius: u(b.radius) }}
      fitKey={fitKey}
    >
      {text}
    </PlainBubble>
  );

  const meta = (
    <Meta spec={spec} m={m} show={last} align={isMe ? "right" : "left"} />
  );

  const bodyWrap = (
    <div
      style={{ position: "relative", flexShrink: isImage ? 0 : 1, minWidth: 0 }}
    >
      {body}
      {isImage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [isMe ? "right" : "left"]: `calc(100% + ${u(spec.image.shareGap)})`,
          }}
        >
          <ShareButton spec={spec} />
        </div>
      )}
    </div>
  );

  if (isMe) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingRight: u(b.rightMargin),
          paddingLeft: u(40),
        }}
      >
        {meta}
        {bodyWrap}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        paddingTop: first ? u(spec.bubbleTopFromAvatar) : 0,
      }}
    >
      {first && (
        <>
          <div
            style={{ position: "absolute", top: 0, left: u(spec.avatar.left) }}
          >
            <KakaoAvatar
              src={partnerAvatar}
              color={avatarColor}
              size={u(spec.avatar.size)}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: u(spec.name.top),
              left: u(b.left + spec.name.dx),
              right: u(40),
              fontSize: u(spec.name.size),
              lineHeight: 1.25,
              color: spec.name.color,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {partnerName}
          </div>
        </>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          paddingLeft: u(b.left),
          paddingRight: u(40),
        }}
      >
        {bodyWrap}
        {meta}
      </div>
    </div>
  );
}
