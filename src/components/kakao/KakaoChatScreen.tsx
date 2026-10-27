"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SPECS, type Platform } from "@/lib/kakaoSpec";
import KakaoStatusBar from "./StatusBar";
import { ChatHeader, ChatInputBar } from "./ChatChrome";
import MessageList, { type KakaoMessage } from "./MessageList";
import { u } from "./units";

export type KakaoChatScreenProps = {
  platform: Platform;
  partnerName: string;
  partnerAvatar: string | null;
  avatarColor: string;
  fontScale: number;
  statusBarTime: string;
  battery: number;
  messages: KakaoMessage[];
  showStatusBar?: boolean;
  fixedHeight?: boolean;
  /** Bake the bottom-scroll position into a transform (for DOM-to-image export, which drops scrollTop). */
  staticScroll?: boolean;
  onBack?: () => void;
  onMessageClick?: (m: KakaoMessage) => void;
};

export type KakaoChatScreenHandle = {
  root: HTMLDivElement | null;
  scrollToBottom: () => void;
};

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const KakaoChatScreen = forwardRef<KakaoChatScreenHandle, KakaoChatScreenProps>(
  function KakaoChatScreen(props, ref) {
    const {
      platform,
      partnerName,
      partnerAvatar,
      avatarColor,
      fontScale,
      statusBarTime,
      battery,
      messages,
      showStatusBar = true,
      fixedHeight = false,
      staticScroll = false,
      onBack,
      onMessageClick,
    } = props;
    const spec = SPECS[platform];
    const id = useId().replace(/:/g, "");
    const rootRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    const scrollToBottom = () => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    };
    useImperativeHandle(ref, () => ({ root: rootRef.current, scrollToBottom }));
    useEffect(scrollToBottom, [messages.length, platform]);
    useLayoutEffect(() => {
      if (!staticScroll) return;
      const sc = scrollRef.current;
      const list = listRef.current;
      if (!sc || !list) return;
      const measure = () => {
        const cs = getComputedStyle(sc);
        const content =
          list.offsetHeight +
          parseFloat(cs.paddingTop) +
          parseFloat(cs.paddingBottom);
        setOffset(Math.max(0, content - sc.clientHeight));
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(list);
      return () => ro.disconnect();
    }, [staticScroll]);

    return (
      <div
        style={{
          containerType: "inline-size",
          width: "100%",
          height: fixedHeight ? "auto" : "100%",
        }}
      >
        <div
          ref={rootRef}
          className="kakao-screen"
          style={
            {
              "--u": `calc(100cqw / ${spec.W})`,
              position: "relative",
              width: "100%",
              height: fixedHeight ? u(spec.H) : "100%",
              overflow: "hidden",
              background: spec.chatBg,
              fontFamily: "var(--font-kakao)",
              letterSpacing: spec.letterSpacing,
              fontWeight: spec.fontWeight,
              WebkitFontSmoothing: "antialiased",
            } as React.CSSProperties
          }
        >
          <div
            ref={scrollRef}
            className="no-scrollbar"
            style={{
              position: "absolute",
              inset: 0,
              overflowY: staticScroll ? "hidden" : "auto",
              paddingTop: u(spec.chatTop),
              paddingBottom: u(spec.inputH + spec.chatBottomGap),
            }}
          >
            <div
              ref={listRef}
              style={
                staticScroll
                  ? { transform: `translateY(${-offset}px)` }
                  : undefined
              }
            >
              <MessageList
                spec={spec}
                messages={messages}
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
                avatarColor={avatarColor}
                fontScale={fontScale}
                onMessageClick={onMessageClick}
              />
            </div>
          </div>

          {platform === "ios" ? (
            // iOS: messages scroll under a translucent bar that fades into the wallpaper
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: u(102),
                background: `linear-gradient(to bottom, ${rgba(spec.chatBg, 0.96)} 0%, ${rgba(spec.chatBg, 0.88)} 64%, ${rgba(spec.chatBg, 0)} 100%)`,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                maskImage:
                  "linear-gradient(to bottom, #000 74%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 74%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: u(92),
                background: spec.chatBg,
                pointerEvents: "none",
              }}
            />
          )}
          {showStatusBar && (
            <KakaoStatusBar
              platform={platform}
              time={statusBarTime}
              battery={battery}
              bg={spec.chatBg}
              id={id}
            />
          )}
          <ChatHeader platform={platform} title={partnerName} onBack={onBack} />
          <ChatInputBar platform={platform} />
        </div>
      </div>
    );
  },
);

export default KakaoChatScreen;
