"use client";

import { useSearchParams } from "next/navigation";
import KakaoChatScreen from "@/components/kakao/KakaoChatScreen";
import type { KakaoMessage } from "@/components/kakao/MessageList";
import { SPEC } from "@/lib/kakaoSpec";

let n = 0;
const m = (
  sender: "ME" | "PARTNER",
  content: string,
  timeLabel: string,
  type: KakaoMessage["type"] = "TEXT",
): KakaoMessage => ({ id: String(n++), sender, content, timeLabel, type, unread: false });
const d = (label: string) => m("ME", label, "", "DATE_DIVIDER");

const FIXTURES: Record<string, { name: string; color: string; time: string; battery: number; messages: KakaoMessage[] }> = {
  android: {
    name: "f. 아바",
    color: "mint",
    time: "",
    battery: 76,
    messages: [
      m("ME", "오늘 버스타고 가?", "오후 4:39"),
      m("PARTNER", "차있는데", "오후 4:39"),
      m("PARTNER", "항상있는자리", "오후 4:39"),
      m("PARTNER", "버스타면 아들힘들어서 공부못해", "오후 4:40"),
      m("ME", "응", "오후 4:40"),
      m("PARTNER", "마쳤어?", "오후 4:40"),
      m("ME", "청소중이야", "오후 4:40"),
      m("PARTNER", "아들 어제먹었던 오리뽁음밥할게 언제먹을겨?", "오후 7:07"),
      d("2026년 10월 27일 화요일"),
      m("PARTNER", "아들 바로올거야?", "오후 4:56"),
    ],
  },
};

export default function PreviewClient() {
  const params = useSearchParams();
  const fx = FIXTURES[params.get("fx") ?? "android"] ?? FIXTURES.android;
  return (
    <div style={{ width: SPEC.W, margin: 0 }} id="frame">
      <KakaoChatScreen
        partnerName={fx.name}
        partnerAvatar={null}
        avatarColor={fx.color}
        fontScale={1}
        statusBarTime={fx.time}
        battery={fx.battery}
        messages={fx.messages}
        fixedHeight
      />
    </div>
  );
}
