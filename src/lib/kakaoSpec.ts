// Layout tokens measured from real KakaoTalk captures.
// android: a 760x1568px screenshot, in dp on a 380x784 screen.
// ios: a 578x1280px screen recording of an iPhone (393x852pt), in pt.
// Everything is rendered relative to the screen width, so proportions hold on any device.

export type Platform = "android" | "ios";

export const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "android", label: "안드로이드" },
  { key: "ios", label: "아이폰" },
];

export function asPlatform(v: string | null | undefined): Platform {
  return v === "ios" ? "ios" : "android";
}

export type Spec = {
  W: number;
  H: number;
  exportWidthPx: number;
  chatBg: string;
  textColor: string;
  letterSpacing: string;
  fontWeight: number;
  defaultAvatar: string;
  defaultClock: string;
  chatTop: number;
  chatBottomGap: number;
  inputH: number;
  avatar: { size: number; left: number };
  name: { size: number; color: string; top: number; dx: number };
  bubbleTopFromAvatar: number;
  bubble: {
    left: number;
    rightMargin: number;
    fontSize: number;
    lineHeight: number;
    padTop: number;
    padBottom: number;
    padH: number;
    radius: number;
    maxWidth: number;
    minWidth: number;
    // the tip sticks out past the body edge; its upper edge meets the corner arc in a small V notch
    tail: {
      tipX: number;
      tipY: number;
      back: number;
      lowCtrlX: number;
      lowCtrlY: number;
      upCtrlX: number;
      upCtrlY: number;
      joinY: number;
    };
  };
  time: { size: number; color: string; gap: number; bottom: number };
  unread: { size: number; color: string };
  gap: { consecutive: number; group: number; date: number };
  datePill: {
    h: number;
    padL: number;
    padR: number;
    fontSize: number;
    color: string;
    bg: string;
    chevronW: number;
    chevronH: number;
    chevronGap: number;
    icon: boolean;
  };
  image: {
    maxW: number;
    maxH: number;
    radius: number;
    shareD: number;
    shareGap: number;
  };
};

const ANDROID: Spec = {
  W: 380,
  H: 784,
  exportWidthPx: 1080,
  chatBg: "#ABC0D1",
  textColor: "#191919",
  letterSpacing: "0.035em",
  fontWeight: 450,
  defaultAvatar: "mint",
  defaultClock: "",
  chatTop: 102,
  chatBottomGap: 12.75,
  inputH: 62,
  avatar: { size: 36, left: 11 },
  name: { size: 12.5, color: "#1C2A33", top: 0.6, dx: 1 },
  bubbleTopFromAvatar: 22.5,
  bubble: {
    left: 54.5,
    rightMargin: 9.8,
    fontSize: 15,
    lineHeight: 21.6,
    padTop: 9.2,
    padBottom: 7.7,
    padH: 11.5,
    radius: 12.5,
    maxWidth: 222,
    minWidth: 38,
    tail: {
      tipX: 1.95,
      tipY: 0.75,
      back: 8,
      lowCtrlX: -0.6,
      lowCtrlY: 3.2,
      upCtrlX: 0.6,
      upCtrlY: 1,
      joinY: 3.4,
    },
  },
  time: { size: 10.2, color: "#3E4E5B", gap: 6, bottom: 1.5 },
  unread: { size: 10.5, color: "#F2C200" },
  gap: { consecutive: 6.8, group: 13.1, date: 13 },
  datePill: {
    h: 30.5,
    padL: 10.5,
    padR: 10.5,
    fontSize: 12.05,
    color: "#1B2730",
    bg: "rgba(0,0,0,0.035)",
    chevronW: 5.5,
    chevronH: 8.5,
    chevronGap: 7,
    icon: false,
  },
  image: { maxW: 266, maxH: 486, radius: 14, shareD: 30, shareGap: 20 },
};

const IOS: Spec = {
  W: 393,
  H: 852,
  exportWidthPx: 1179,
  chatBg: "#ABC0D1",
  textColor: "#191919",
  letterSpacing: "0",
  fontWeight: 470,
  defaultAvatar: "teal",
  defaultClock: "9:41",
  chatTop: 104,
  chatBottomGap: 12,
  inputH: 76.5,
  avatar: { size: 34.5, left: 10.3 },
  name: { size: 11.8, color: "#1C2A33", top: -0.9, dx: 0.8 },
  bubbleTopFromAvatar: 18,
  bubble: {
    left: 51.8,
    rightMargin: 9.15,
    fontSize: 12,
    lineHeight: 14.6,
    padTop: 9.8,
    padBottom: 8.8,
    padH: 10.6,
    radius: 11.5,
    maxWidth: 227,
    minWidth: 33,
    tail: {
      tipX: 1.85,
      tipY: 0.7,
      back: 7.6,
      lowCtrlX: -0.57,
      lowCtrlY: 3,
      upCtrlX: 0.57,
      upCtrlY: 0.95,
      joinY: 3.2,
    },
  },
  time: { size: 10.4, color: "#3E4E5B", gap: 5.5, bottom: 0.5 },
  unread: { size: 10.4, color: "#F2C200" },
  gap: { consecutive: 6.5, group: 14.7, date: 20 },
  datePill: {
    h: 26.5,
    padL: 9.5,
    padR: 12,
    fontSize: 12.3,
    color: "rgba(255,255,255,0.9)",
    bg: "rgba(0,0,0,0.075)",
    chevronW: 4.1,
    chevronH: 7.4,
    chevronGap: 6.8,
    icon: true,
  },
  image: { maxW: 275, maxH: 503, radius: 14, shareD: 30, shareGap: 20.5 },
};

export const SPECS: Record<Platform, Spec> = { android: ANDROID, ios: IOS };

export const AVATAR_COLORS = [
  { key: "mint", base: "#88DCD6", light: "#9EE5DF", figure: "#E1F7F5" },
  { key: "teal", base: "#4AA7BA", light: "#53AEC1", figure: "#93D6E8" },
  { key: "blue", base: "#7FA8E8", light: "#8CB3EE", figure: "#D5E3FA" },
  { key: "purple", base: "#A99BE6", light: "#B5A9EC", figure: "#E3DEFA" },
  { key: "pink", base: "#F0A3B8", light: "#F4B1C3", figure: "#FBE2E9" },
  { key: "orange", base: "#F6B36F", light: "#F8BF83", figure: "#FDE6CF" },
  { key: "green", base: "#8FCB7E", light: "#9CD38C", figure: "#DDF1D7" },
  { key: "gray", base: "#AEB7BF", light: "#BAC2C9", figure: "#E6EAED" },
] as const;

export function avatarColor(key: string | null | undefined) {
  return AVATAR_COLORS.find((c) => c.key === key) ?? AVATAR_COLORS[0];
}
