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
import { SPEC } from "@/lib/kakaoSpec";
import KakaoStatusBar from "./StatusBar";
import { ChatHeader, ChatInputBar } from "./ChatChrome";
import MessageList, { type KakaoMessage } from "./MessageList";
import { u } from "./units";

export type KakaoChatScreenProps = {
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

const KakaoChatScreen = forwardRef<KakaoChatScreenHandle, KakaoChatScreenProps>(
  function KakaoChatScreen(props, ref) {
    const {
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
    useEffect(scrollToBottom, [messages.length]);
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
              "--u": `calc(100cqw / ${SPEC.W})`,
              position: "relative",
              width: "100%",
              height: fixedHeight ? u(SPEC.H) : "100%",
              overflow: "hidden",
              background: SPEC.chatBg,
              fontFamily: "var(--font-kakao)",
              letterSpacing: SPEC.letterSpacing,
              fontWeight: SPEC.fontWeight,
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
              paddingTop: u(SPEC.chatTop),
              paddingBottom: u(SPEC.inputH + SPEC.chatBottomGap),
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
                messages={messages}
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
                avatarColor={avatarColor}
                fontScale={fontScale}
                onMessageClick={onMessageClick}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: u(SPEC.headerClip),
              background: SPEC.chatBg,
              pointerEvents: "none",
            }}
          />
          {showStatusBar && (
            <KakaoStatusBar
              time={statusBarTime}
              battery={battery}
              bg={SPEC.chatBg}
              id={id}
            />
          )}
          <ChatHeader title={partnerName} onBack={onBack} />
          <ChatInputBar />
        </div>
      </div>
    );
  },
);

export default KakaoChatScreen;
