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
const PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#4F7A3A"/></svg>',
  );
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
  // a real iPhone screenshot at the default text size
  yumi: {
    platform: "ios",
    name: "유미",
    color: "sky",
    time: "9:15",
    battery: 58,
    messages: [
      d("2026년 10월 22일 목요일"),
      m(
        "ME",
        "아침일찍이라서 그런가\n전화를 안받노 ㅜ\n유미야 태영이 언니 인데 저번에 부탁한거 오늘 좀 가능할까 ?",
        "오전 8:17",
      ),
      m(
        "PARTNER",
        "아 언니 운전한다구요 미안요ㅎ 500만원이 될려나 모르겠넹 😭\n되면 바로 보낼께요 일단 계좌 주세요 언니",
        "오전 9:02",
      ),
      m(
        "ME",
        "ㅇㅇ부탁좀요 급해서리\n보내고 톡 주고\n우리 심태영 1005 803 524921",
        "오전 9:11",
      ),
      m(
        "PARTNER",
        "언니 보냈어용ㅎ\n가게이름 현정이로 보냈어요ㅎ",
        "오전 9:31",
      ),
    ],
  },
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
  // Kakao's App Store capture (iOS 26); the shared video card is stood in by a plain 3:4 image.
  ios: {
    platform: "ios",
    name: "대학교 친구들 3",
    color: "teal",
    time: "9:41",
    battery: 100,
    messages: [
      m("ME", PHOTO, "오후 12:03", "IMAGE"),
      m("ME", "댕댕이 너무 귀여워", "오후 12:03"),
      m("PARTNER", "귀 펄럭이는 것 좀 봐", "오후 12:03"),
      m("PARTNER", "진짜 사랑스럽다", "오후 12:04"),
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
