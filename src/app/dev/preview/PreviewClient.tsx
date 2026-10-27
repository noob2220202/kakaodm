"use client";

import { useSearchParams } from "next/navigation";
import KakaoChatScreen from "@/components/kakao/KakaoChatScreen";
import type { KakaoMessage } from "@/components/kakao/MessageList";
import { SPECS, type Platform } from "@/lib/kakaoSpec";

// Conversations copied from the reference captures, for side-by-side pixel comparison.
let n = 0;
const m = (
  sender: "ME" | "PARTNER",
  content: string,
  timeLabel: string,
  type: KakaoMessage["type"] = "TEXT",
): KakaoMessage => ({
  id: String(n++),
  sender,
  content,
  timeLabel,
  type,
  unread: false,
});
const d = (label: string) => m("ME", label, "", "DATE_DIVIDER");

type Fixture = {
  platform: Platform;
  name: string;
  color: string;
  time: string;
  battery: number;
  messages: KakaoMessage[];
};

const FIXTURES: Record<string, Fixture> = {
  android: {
    platform: "android",
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
  ios: {
    platform: "ios",
    name: "김동철 데포",
    color: "teal",
    time: "9:45",
    battery: 73,
    messages: [
      m("ME", "완료입니다", "오전 11:45"),
      d("2026년 10월 12일 월요일"),
      m("PARTNER", "사장님 계시나요?", "오전 11:15"),
      m("ME", "점심 먹고잇습니다", "오전 11:16"),
      m("PARTNER", "아ㅜㅜ급한데", "오전 11:16"),
      m("ME", "1시 이후 문의주세여ㅜㅜ", "오전 11:16"),
      m("PARTNER", "네ㅜㅜ", "오전 11:16"),
      m("PARTNER", "오셧나요?", "오후 1:16"),
      m("ME", "네!", "오후 1:16"),
      m("PARTNER", "1442만 구매할게용", "오후 1:20"),
      m("ME", "네네 101만 입니다!", "오후 1:22"),
      m("PARTNER", "송금바로 해드릴까요?", "오후 1:25"),
      m("ME", "네 해주세요", "오후 1:27"),
    ],
  },
};

export default function PreviewClient() {
  const params = useSearchParams();
  const fx = FIXTURES[params.get("fx") ?? "android"] ?? FIXTURES.android;
  return (
    <div style={{ width: SPECS[fx.platform].W, margin: 0 }} id="frame">
      <KakaoChatScreen
        platform={fx.platform}
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
